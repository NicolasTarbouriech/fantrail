import { cx } from '@trail/shared/design/ui-react';

import { formatMultiplier, getMultiplier, isOutsider } from '../mappers';

export type MultiplierBadgeProps = {
  favoriteRank: number | null;
};

export function MultiplierBadge({ favoriteRank }: MultiplierBadgeProps) {
  const outsider = isOutsider(favoriteRank);
  return (
    <span
      className={cx(
        'border-ink font-display rounded-lg border-2 px-2 py-0.5 text-[17px]',
        outsider
          ? 'bg-highlight rotate-3 font-black'
          : 'bg-white font-extrabold',
      )}
    >
      {formatMultiplier(getMultiplier(favoriteRank))}
    </span>
  );
}
