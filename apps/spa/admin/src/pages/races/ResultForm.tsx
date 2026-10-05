import { useState } from 'react';

import {
  formatClockTime,
  maskClockTime,
  parseClockTime,
} from '@trail/modules-frontend';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminField,
  AdminInput,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

import { ConfirmDialog } from './ConfirmDialog';
import type { AdminRunner, AdminField as RaceFieldType } from './raceTypes';

const RANKED_PLACES = 10;

export type ResultFormProps = {
  field: RaceFieldType;
  isPending: boolean;
  error: string | null;
  onPublish: (
    rankingList: string[],
    winnerTimeInSeconds: number,
  ) => Promise<boolean>;
};

export function ResultForm({
  field,
  isPending,
  error,
  onPublish,
}: ResultFormProps) {
  const runners = [...field.startList.runners]
    .filter((runner) => !runner.isWithdrawn)
    .sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
  const runnerById = new Map(
    field.startList.runners.map((runner) => [runner.id, runner]),
  );
  // Typed labels map back to runners; the rank tells namesakes apart.
  const labelOf = (runner: AdminRunner) =>
    [
      `${runner.lastName.toUpperCase()} ${runner.firstName}`,
      runner.nationality,
      runner.favoriteRank ? `n°${runner.favoriteRank}` : null,
    ]
      .filter(Boolean)
      .join(' · ');
  const idByLabel = new Map(
    runners.map((runner) => [labelOf(runner), runner.id]),
  );
  const [texts, setTexts] = useState<string[]>(() =>
    Array.from({ length: RANKED_PLACES }, (_, index) => {
      const runner = runnerById.get(field.result?.rankingList[index] ?? '');
      return runner ? labelOf(runner) : '';
    }),
  );
  const ranking = texts.map((text) => idByLabel.get(text) ?? '');
  const unknownPlaces = texts.filter(
    (text, index) => text.trim() && !ranking[index],
  );
  const [timeInput, setTimeInput] = useState(
    field.result ? formatClockTime(field.result.winnerTimeInSeconds) : '',
  );
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const filled = ranking.filter(Boolean);
  const duplicates = new Set(
    filled.filter((id, index) => filled.indexOf(id) !== index),
  );
  const hasGap =
    ranking.findIndex((id) => !id) !== -1 &&
    ranking.slice(ranking.findIndex((id) => !id)).some(Boolean);
  const winnerTime = parseClockTime(timeInput);
  const version = field.result?.version ?? 0;

  const check = () => {
    if (unknownPlaces.length > 0) {
      return 'Choisis chaque coureur dans les suggestions.';
    }
    if (filled.length === 0) {
      return 'Saisis au moins le vainqueur.';
    }
    if (duplicates.size > 0) {
      return 'Un coureur ne peut apparaître qu’une fois.';
    }
    if (hasGap) {
      return 'Remplis les places dans l’ordre, sans trou.';
    }
    if (winnerTime === null) {
      return 'Temps du vainqueur au format hh:mm:ss.';
    }
    return null;
  };

  const askPublish = () => {
    const problem = check();
    setLocalError(problem);
    if (!problem) {
      setConfirmOpen(true);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <AdminCard className="p-0">
        <div className="px-5 pt-5">
          <AdminCardHeader
            title="Classement officiel"
            description="Saisis le top 10 depuis LiveTrail. Tout coureur hors du top 10 marque 0."
          />
        </div>
        <ol className="m-0 flex list-none flex-col p-0">
          {texts.map((text, index) => (
            <li
              key={index}
              className="grid grid-cols-[56px_minmax(0,1fr)_96px] items-center gap-2 border-t border-zinc-100 px-5 py-1.5"
            >
              <span className="font-bold tabular-nums">{index + 1}</span>
              <AdminInput
                aria-label={`Coureur en position ${index + 1}`}
                list={`result-runners-${field.id}`}
                placeholder="Tape un nom"
                autoComplete="off"
                value={text}
                onChange={(event) =>
                  setTexts((current) =>
                    current.map((item, position) =>
                      position === index ? event.target.value : item,
                    ),
                  )
                }
                className={
                  duplicates.has(ranking[index]) ||
                  (text.trim() && !ranking[index])
                    ? 'border-red-400'
                    : undefined
                }
              />
              <span className="text-right text-[13px] text-zinc-500">
                {text.trim() && !ranking[index] ? 'inconnu' : ''}
              </span>
            </li>
          ))}
        </ol>
        <datalist id={`result-runners-${field.id}`}>
          {runners.map((runner) => (
            <option key={runner.id} value={labelOf(runner)} />
          ))}
        </datalist>
      </AdminCard>
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <AdminCard>
          <AdminField
            id="winner-time"
            label="Temps du vainqueur"
            hint="Format hh:mm:ss, temps officiel LiveTrail."
          >
            <AdminInput
              id="winner-time"
              inputMode="numeric"
              placeholder="23:32:00"
              value={timeInput}
              onChange={(event) =>
                setTimeInput(maskClockTime(event.target.value, 3))
              }
              className="tabular-nums"
            />
          </AdminField>
        </AdminCard>
        <AdminCard>
          <AdminCardHeader
            title="Publication"
            description={
              field.result?.publishedAt
                ? `Version ${version} en ligne.`
                : 'Aucune version publiée.'
            }
          />
          <AdminNotice>
            Publier recalcule les scores de tous les joueurs. Une correction
            crée une nouvelle version.
          </AdminNotice>
          {localError || error ? (
            <AdminNotice tone="danger">{localError ?? error}</AdminNotice>
          ) : null}
          <AdminButton
            variant="primary"
            className="justify-center"
            onClick={askPublish}
            disabled={isPending || !field.isLocked}
          >
            {version > 0
              ? `Publier la correction (v${version + 1})`
              : 'Publier le résultat'}
          </AdminButton>
          {!field.isLocked ? (
            <p className="m-0 text-[13px] text-zinc-500">
              Le champ doit être verrouillé avant de publier son résultat.
            </p>
          ) : null}
        </AdminCard>
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title={
          version > 0
            ? `Publier la version ${version + 1} ?`
            : 'Publier le résultat ?'
        }
        confirmLabel="Publier"
        isPending={isPending}
        error={error}
        onConfirm={async () => {
          if (winnerTime !== null && (await onPublish(filled, winnerTime))) {
            setConfirmOpen(false);
          }
        }}
        onClose={() => setConfirmOpen(false)}
      >
        Les scores de ce champ sont recalculés pour tous les joueurs et les
        classements des ligues sont mis à jour.
      </ConfirmDialog>
    </div>
  );
}
