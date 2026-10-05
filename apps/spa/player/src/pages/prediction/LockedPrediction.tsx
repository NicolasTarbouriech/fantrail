import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  PickSlot,
  createPickList,
  formatWinnerTime,
  getFieldSlug,
} from '@trail/modules-frontend';
import { Callout, Heading, buttonClasses } from '@trail/shared/design/ui-react';

import { paths } from '../../app/paths';
import { PredictionColumns } from './PredictionColumns';
import type {
  PredictionField,
  PredictionRace,
  SavedPrediction,
} from './predictionTypes';

export type LockedPredictionProps = {
  race: PredictionRace;
  field: PredictionField;
  saved: SavedPrediction | null;
  fieldTabs: ReactNode;
};

export function LockedPrediction({
  race,
  field,
  saved,
  fieldTabs,
}: LockedPredictionProps) {
  const runnerById = new Map(
    field.startList.runners.map((runner) => [runner.id, runner]),
  );
  const pickList = createPickList(race.pickCount, saved?.pickList ?? []);
  const hasResult = Boolean(field.result);

  return (
    <PredictionColumns>
      {fieldTabs}
      <div className="flex items-baseline justify-between">
        <Heading className="text-[26px]">Ton top {race.pickCount}</Heading>
        <span className="text-muted text-xs font-semibold">figé au départ</span>
      </div>
      <ol className="m-0 flex list-none flex-col gap-[9px] p-0">
        {pickList.map((runnerId, position) => {
          const runner = runnerId ? runnerById.get(runnerId) : undefined;
          return (
            <li key={position}>
              <PickSlot
                position={position + 1}
                isLocked
                runner={
                  runner
                    ? {
                        fullName: runner.fullName,
                        favoriteRank: runner.favoriteRank ?? null,
                        isWithdrawn: runner.isWithdrawn,
                      }
                    : null
                }
              />
            </li>
          );
        })}
      </ol>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-xl font-black tracking-wide uppercase">
          Chrono du vainqueur
        </span>
        <span className="border-ink bg-ink text-highlight font-display flex h-[52px] w-[120px] items-center justify-center rounded-xl border-2 text-[34px] font-black tracking-wide">
          {formatWinnerTime(saved?.winnerTimeEstimateInSeconds) || '—'}
        </span>
      </div>
      {saved?.isComplete ? (
        <Callout>
          Ton prono n’est plus modifiable et les membres de tes ligues le
          voient.{' '}
          {hasResult
            ? 'Les résultats sont publiés : ta scorecard t’attend.'
            : 'Ta scorecard s’affichera dès la publication des résultats.'}
        </Callout>
      ) : (
        <Callout tone="warning">
          Ton prono était incomplet au départ : il ne marque aucun point sur ce
          champ.
        </Callout>
      )}
      <Link
        to={
          hasResult
            ? paths.scorecard(race.id, getFieldSlug(field.gender))
            : paths.leagues
        }
        className={buttonClasses({ variant: 'cta', size: 'lg', block: true })}
      >
        {hasResult ? 'Voir ma scorecard' : 'Voir les pronos de mes ligues'}
      </Link>
    </PredictionColumns>
  );
}
