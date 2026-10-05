import { cx } from '@trail/shared/design/ui-react';

import { MultiplierBadge } from './MultiplierBadge';

// Start lists run into thousands of runners: a long rank shrinks to stay in its column.
function getRankSizeClass(rankLabel: string): string {
  if (rankLabel.length >= 5) {
    return 'text-[15px]';
  }
  return rankLabel.length === 4 ? 'text-lg' : 'text-[22px]';
}

export type RunnerOptionProps = {
  fullName: string;
  favoriteRank: number | null;
  details: string;
  pickedLabel: string | null;
  onSelect: () => void;
};

export function RunnerOption({
  fullName,
  favoriteRank,
  details,
  pickedLabel,
  onSelect,
}: RunnerOptionProps) {
  const rankLabel = favoriteRank === null ? '—' : `#${favoriteRank}`;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        'flex h-[54px] w-full shrink-0 cursor-pointer items-center gap-3 rounded-xl border-2 pr-3 pl-1.5 text-left',
        pickedLabel
          ? 'border-line-strong bg-disabled text-[#6a7090]'
          : 'border-ink shadow-block text-ink bg-white',
      )}
    >
      <span
        className={cx(
          'font-display w-12 shrink-0 text-center leading-none font-black',
          getRankSizeClass(rankLabel),
          !pickedLabel && 'text-primary',
        )}
      >
        {rankLabel}
      </span>
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate text-[15px] font-bold uppercase">
          {fullName}
        </span>
        <span className={cx('text-xs', !pickedLabel && 'text-muted')}>
          {details}
        </span>
      </span>
      {pickedLabel ? (
        <span className="text-xs font-bold uppercase">{pickedLabel}</span>
      ) : (
        <MultiplierBadge favoriteRank={favoriteRank} />
      )}
    </button>
  );
}
