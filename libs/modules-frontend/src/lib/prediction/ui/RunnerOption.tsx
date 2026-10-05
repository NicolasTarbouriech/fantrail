import { cx } from '@trail/shared/design/ui-react';

import { MultiplierBadge } from './MultiplierBadge';

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
          'font-display w-10 shrink-0 text-center text-[22px] font-black',
          !pickedLabel && 'text-primary',
        )}
      >
        {favoriteRank === null ? '—' : `#${favoriteRank}`}
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
