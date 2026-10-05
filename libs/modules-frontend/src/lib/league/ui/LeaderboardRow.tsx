import { Link } from 'react-router-dom';

import { Bib, cx } from '@trail/shared/design/ui-react';

import { formatPoints } from '../mappers';

export type LeaderboardRowProps = {
  rank: number;
  pseudo: string;
  total: number;
  isMe: boolean;
  hasScored: boolean;
  to?: string;
  caption?: string;
};

export function LeaderboardRow({
  rank,
  pseudo,
  total,
  isMe,
  hasScored,
  to,
  caption,
}: LeaderboardRowProps) {
  const className = cx(
    'text-ink flex h-[60px] items-center gap-3 rounded-[14px] border-2 pr-3.5 pl-1.5 no-underline',
    hasScored || isMe
      ? 'border-ink shadow-block'
      : 'border-faded border-dashed',
    isMe ? 'bg-highlight' : hasScored ? 'bg-white' : 'bg-transparent',
  );
  const content = (
    <>
      <Bib
        tone={
          rank === 1 && hasScored
            ? 'gold'
            : hasScored || isMe
              ? 'primary'
              : 'faded'
        }
        className={cx('h-[46px] w-[46px]', isMe && 'bg-white')}
      >
        {rank}
      </Bib>
      <span className="flex min-w-0 grow flex-col">
        <span
          className={cx(
            'truncate text-base font-bold',
            !hasScored && !isMe && 'text-muted',
          )}
        >
          {isMe ? `${pseudo} · toi` : pseudo}
        </span>
        {caption ? (
          <span className="text-xs font-semibold">{caption}</span>
        ) : null}
      </span>
      <span
        className={cx(
          'font-display text-2xl font-black',
          !hasScored && !isMe && 'text-muted',
        )}
      >
        {formatPoints(total)}
      </span>
      <span className={cx('text-xs', !isMe && 'text-muted')}>pts</span>
    </>
  );
  return (
    <li>
      {to ? (
        <Link to={to} className={className}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}
