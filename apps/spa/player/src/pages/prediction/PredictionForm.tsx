import { type ReactNode, useState } from 'react';

import {
  clearPick,
  countPicks,
  createPickList,
  formatDayTime,
  formatWinnerTime,
  getFieldLabel,
  getMissingPickHint,
  isSamePickList,
  movePick,
  parseWinnerTime,
  setPick,
} from '@trail/modules-frontend';
import {
  Button,
  CheckIcon,
  Heading,
  inputClasses,
} from '@trail/shared/design/ui-react';

import { DESKTOP_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import { getErrorMessage } from '../../services/errors';
import { usePredictionPageMutateSaveMutation } from '../../services/graphql';
import { PredictionColumns } from './PredictionColumns';
import { RunnerPickerPanel } from './RunnerPickerPanel';
import { RunnerPickerSheet } from './RunnerPickerSheet';
import { SortablePickList } from './SortablePickList';
import type {
  PredictionField,
  PredictionRace,
  SavedPrediction,
} from './predictionTypes';

export type PredictionFormProps = {
  race: PredictionRace;
  field: PredictionField;
  saved: SavedPrediction | null;
  fieldTabs: ReactNode;
};

export function PredictionForm({
  race,
  field,
  saved,
  fieldTabs,
}: PredictionFormProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const savedPickList = createPickList(race.pickCount, saved?.pickList ?? []);
  const savedTime = formatWinnerTime(saved?.winnerTimeEstimateInSeconds);
  const [pickList, setPickList] = useState(savedPickList);
  const [timeInput, setTimeInput] = useState(savedTime);
  const [pickerPosition, setPickerPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [save, saveState] = usePredictionPageMutateSaveMutation({
    refetchQueries: ['PredictionPage'],
  });

  const runnerById = new Map(
    field.startList.runners.map((runner) => [runner.id, runner]),
  );
  const winnerTime = parseWinnerTime(timeInput);
  const timeError = timeInput.trim() !== '' && winnerTime === null;
  const isDirty =
    !isSamePickList(pickList, savedPickList) ||
    (timeInput.trim() !== savedTime &&
      !(timeInput.trim() === '' && savedTime === ''));
  const filled = countPicks(pickList);
  const isSavedComplete = Boolean(saved?.isComplete) && !isDirty;
  const hint = getMissingPickHint(race.pickCount, pickList, winnerTime);
  const firstEmptyPosition = pickList.indexOf(null);
  // On desktop the start list stays open and fills the chosen place, else the first empty one.
  const activePosition = isDesktop
    ? (pickerPosition ??
      (firstEmptyPosition === -1 ? null : firstEmptyPosition))
    : null;

  const pick = (runnerId: string) => {
    const position = isDesktop ? activePosition : pickerPosition;
    if (position !== null) {
      setPickList((current) =>
        current[position] === runnerId
          ? clearPick(current, position)
          : setPick(current, position, runnerId),
      );
    }
    setPickerPosition(null);
  };

  const submit = async () => {
    setError(null);
    try {
      await save({
        variables: {
          fieldId: field.id,
          pickList,
          winnerTimeEstimateInSeconds: winnerTime,
        },
      });
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  };

  return (
    <PredictionColumns
      aside={
        isDesktop ? (
          <RunnerPickerPanel
            position={activePosition}
            fieldLabel={getFieldLabel(field.gender)}
            runners={field.startList.runners}
            pickList={pickList}
            onPick={pick}
          />
        ) : null
      }
    >
      {fieldTabs}
      {isSavedComplete && saved ? (
        <div className="border-ink flex items-center gap-2.5 rounded-[14px] border-2 bg-white px-3 py-2.5">
          <span className="border-ink bg-primary flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-white">
            <CheckIcon size={16} />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold">Prono complet, il compte</span>
            <span className="text-muted text-xs">
              Enregistré {formatDayTime(saved.updatedAt)} · modifiable jusqu’au
              départ
            </span>
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between">
          <Heading className="text-[26px]">Ton top {race.pickCount}</Heading>
          <span className="font-display text-primary text-xl font-extrabold">
            {filled}/{race.pickCount}
          </span>
        </div>
        <span className="text-muted text-xs">
          {isDesktop
            ? 'Choisis une place puis un coureur dans la start list, glisse la poignée pour changer l’ordre'
            : 'Touche une place pour choisir un coureur, glisse la poignée pour changer l’ordre'}
        </span>
      </div>
      <SortablePickList
        slots={pickList.map((runnerId) => {
          const runner = runnerId ? runnerById.get(runnerId) : undefined;
          return runner
            ? {
                fullName: runner.fullName,
                favoriteRank: runner.favoriteRank,
                isWithdrawn: runner.isWithdrawn,
              }
            : null;
        })}
        activePosition={activePosition}
        onChoose={setPickerPosition}
        onMove={(from, to) =>
          setPickList((current) => movePick(current, from, to))
        }
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <label
            htmlFor="winner-time"
            className="font-display text-xl font-black tracking-wide uppercase"
          >
            Chrono du vainqueur
          </label>
          <span
            className={
              timeError
                ? 'text-alert text-xs font-semibold'
                : 'text-muted text-xs'
            }
          >
            {timeError
              ? 'Format hh:mm, par exemple 23:45'
              : `Jusqu’à 200 pts · ± ${race.timeTolerancePercent} %`}
          </span>
        </div>
        <input
          id="winner-time"
          type="text"
          inputMode="numeric"
          placeholder="hh:mm"
          autoComplete="off"
          value={timeInput}
          onChange={(event) => setTimeInput(event.target.value)}
          aria-invalid={timeError || undefined}
          className={inputClasses('chrono')}
        />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {isDirty || !saved ? (
          <Button
            variant="cta"
            size="lg"
            block
            onClick={submit}
            disabled={
              saveState.loading ||
              timeError ||
              (!saved && filled === 0 && winnerTime === null)
            }
          >
            Valider mon prono
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            block
            disabled
            className="font-display text-2xl font-black uppercase"
          >
            <CheckIcon className="text-primary" />
            Prono enregistré
          </Button>
        )}
        {error ? (
          <p
            role="alert"
            className="text-alert m-0 text-center text-sm font-semibold"
          >
            {error}
          </p>
        ) : (
          <span className="text-muted text-center text-xs">
            {isDirty
              ? (hint ?? 'Pense à valider tes changements')
              : isSavedComplete
                ? 'Change un coureur ou l’ordre : le bouton repasse en jaune pour enregistrer.'
                : (hint ?? '')}
          </span>
        )}
      </div>
      {isDesktop ? null : (
        <RunnerPickerSheet
          position={pickerPosition}
          fieldLabel={getFieldLabel(field.gender)}
          runners={field.startList.runners}
          pickList={pickList}
          onClose={() => setPickerPosition(null)}
          onPick={pick}
        />
      )}
    </PredictionColumns>
  );
}
