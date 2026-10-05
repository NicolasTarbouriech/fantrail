import type { ReactNode } from 'react';

import { Bib, PlusIcon, cx } from '@trail/shared/design/ui-react';

import { formatFavoriteRank } from '../mappers';
import { MultiplierBadge } from './MultiplierBadge';

export type PickSlotRunner = {
  fullName: string;
  favoriteRank: number | null;
  isWithdrawn: boolean;
};

export type PickSlotProps = {
  position: number;
  runner: PickSlotRunner | null;
  isLocked?: boolean;
  /** The place the runner list fills, on wide screens. */
  isActive?: boolean;
  onChoose?: () => void;
  dragHandle?: ReactNode;
};

const ACTIVE_CLASSES = 'outline-primary outline-3 outline-offset-2';

export function PickSlot({
  position,
  runner,
  isLocked = false,
  isActive = false,
  onChoose,
  dragHandle,
}: PickSlotProps) {
  if (!runner) {
    return isLocked ? (
      <div className="border-faded text-muted flex h-14 items-center gap-3 rounded-[14px] border-2 border-dashed px-3 pl-1.5">
        <Bib tone="faded">{position}</Bib>
        <span className="text-sm font-semibold">Place vide</span>
      </div>
    ) : (
      <button
        type="button"
        onClick={onChoose}
        aria-pressed={isActive || undefined}
        className={cx(
          'border-ink text-primary font-display flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border-2 border-dashed text-xl font-extrabold tracking-wide uppercase',
          isActive ? cx(ACTIVE_CLASSES, 'bg-primary-soft') : 'bg-transparent',
        )}
      >
        <PlusIcon />
        Choisis ton {position === 1 ? '1ᵉʳ' : `${position}ᵉ`} coureur
      </button>
    );
  }
  if (runner.isWithdrawn) {
    return (
      <div
        className={cx(
          'border-alert bg-alert-soft flex h-14 items-center gap-3 rounded-[14px] border-2 border-dashed pr-3 pl-1.5',
          isActive && ACTIVE_CLASSES,
        )}
      >
        <Bib tone="alert">{position}</Bib>
        <div className="flex grow flex-col">
          <span className="text-[15px] font-bold text-[#6b4a3f] uppercase line-through">
            {runner.fullName}
          </span>
          <span className="text-alert text-xs font-bold">RETIRÉ · 0 PT</span>
        </div>
        {!isLocked ? (
          <button
            type="button"
            onClick={onChoose}
            className="border-ink bg-ink h-9 cursor-pointer rounded-full border-2 px-3 text-[13px] font-bold text-white"
          >
            Changer
          </button>
        ) : null}
      </div>
    );
  }
  return (
    <div
      className={cx(
        'border-ink flex h-14 items-center gap-3 rounded-[14px] border-2 bg-white pr-3 pl-1.5',
        !isLocked && 'shadow-block',
        isActive && ACTIVE_CLASSES,
      )}
    >
      <Bib tone={isLocked ? 'ink' : 'primary'}>{position}</Bib>
      <button
        type="button"
        onClick={onChoose}
        disabled={isLocked}
        className="flex min-w-0 grow cursor-pointer flex-col items-start border-0 bg-transparent p-0 text-left disabled:cursor-default"
      >
        <span className="max-w-full truncate text-[15px] font-bold uppercase">
          {runner.fullName}
        </span>
        <span className="text-muted text-xs">
          {formatFavoriteRank(runner.favoriteRank)}
        </span>
      </button>
      <MultiplierBadge favoriteRank={runner.favoriteRank} />
      {dragHandle}
    </div>
  );
}
