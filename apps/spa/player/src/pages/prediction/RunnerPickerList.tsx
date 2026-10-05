import { useMemo, useState } from 'react';

import {
  type PickList,
  type PickerOrder,
  RunnerOption,
  formatRank,
  selectPickerRunners,
} from '@trail/modules-frontend';
import { SearchIcon, cx } from '@trail/shared/design/ui-react';

import type { PredictionRunner } from './predictionTypes';

export type RunnerPickerListProps = {
  position: number | null;
  runners: PredictionRunner[];
  pickList: PickList;
  onPick: (runnerId: string) => void;
};

const SORT_ORDERS: PickerOrder[] = ['index', 'name'];

export function getActiveRunners(
  runners: PredictionRunner[],
): PredictionRunner[] {
  return runners.filter((runner) => !runner.isWithdrawn);
}

/** Search, sort and runner rows, shared by the phone sheet and the desktop panel. */
export function RunnerPickerList({
  position,
  runners,
  pickList,
  onPick,
}: RunnerPickerListProps) {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<PickerOrder>('index');
  const { runners: visibleRunners, hiddenCount } = useMemo(
    () => selectPickerRunners(runners, { query: search, order }),
    [runners, order, search],
  );

  return (
    <>
      <label className="border-ink flex h-12 shrink-0 items-center gap-2.5 rounded-xl border-2 bg-white px-3.5">
        <SearchIcon size={18} className="text-muted" />
        <input
          type="search"
          placeholder="Rechercher un coureur"
          aria-label="Rechercher un coureur"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="text-ink h-10 min-w-0 grow border-0 bg-transparent text-base outline-none"
        />
      </label>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div role="group" aria-label="Trier" className="flex gap-2">
          {SORT_ORDERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={order === value}
              onClick={() => setOrder(value)}
              className={cx(
                'border-ink h-9 cursor-pointer rounded-full border-2 px-3 text-[13px] font-bold',
                order === value ? 'bg-ink text-white' : 'text-ink bg-white',
              )}
            >
              {value === 'index' ? 'Par index' : 'Par nom'}
            </button>
          ))}
        </div>
        <span className="text-muted text-xs">Outsider = plus de points</span>
      </div>
      {visibleRunners.map((runner) => {
        const pickedPosition = pickList.indexOf(runner.id);
        return (
          <RunnerOption
            key={runner.id}
            fullName={runner.fullName}
            favoriteRank={runner.favoriteRank}
            details={[
              runner.nationality,
              runner.index ? `index ${runner.index}` : 'sans index',
            ]
              .filter(Boolean)
              .join(' · ')}
            pickedLabel={
              pickedPosition === -1 || pickedPosition === position
                ? null
                : `Déjà ${formatRank(pickedPosition + 1)}`
            }
            onSelect={() => onPick(runner.id)}
          />
        );
      })}
      {hiddenCount > 0 ? (
        <p className="text-muted m-0 py-2 text-center text-[13px]">
          Les {visibleRunners.length} meilleurs index du champ. Cherche un nom
          pour trouver l’un des {hiddenCount} autres coureurs.
        </p>
      ) : null}
      {visibleRunners.length === 0 ? (
        <p className="text-muted m-0 py-4 text-center text-sm">
          Aucun coureur trouvé.
        </p>
      ) : null}
    </>
  );
}
