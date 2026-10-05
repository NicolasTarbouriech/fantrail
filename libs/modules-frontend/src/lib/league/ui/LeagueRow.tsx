import { Link } from 'react-router-dom';

import { ChevronRightIcon, cx } from '@trail/shared/design/ui-react';

import { formatRank } from '../mappers';

export type LeagueRowProps = {
  name: string;
  badge: string;
  badgeTone: 'outline' | 'ink';
  details: string;
  standing: { rank: number; playerCount: number } | null;
  to: string;
};

export function LeagueRow({
  name,
  badge,
  badgeTone,
  details,
  standing,
  to,
}: LeagueRowProps) {
  return (
    <Link
      to={to}
      className="border-ink shadow-block text-ink flex min-h-16 items-center gap-3 rounded-[14px] border-2 bg-white px-3.5 py-2 no-underline"
    >
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="truncate text-base font-bold">{name}</span>
        <span className="text-muted flex items-center gap-1.5 text-xs">
          <span
            className={cx(
              'rounded-md px-1.5 py-px text-[10px] font-bold',
              badgeTone === 'ink'
                ? 'bg-ink text-white'
                : 'border-ink text-ink border-2 bg-white',
            )}
          >
            {badge}
          </span>
          {details}
        </span>
      </span>
      {standing ? (
        <>
          <span className="font-display text-primary text-[26px] font-black">
            {formatRank(standing.rank)}
          </span>
          <span className="text-muted text-[13px]">
            / {standing.playerCount}
          </span>
        </>
      ) : null}
      <ChevronRightIcon size={18} />
    </Link>
  );
}
