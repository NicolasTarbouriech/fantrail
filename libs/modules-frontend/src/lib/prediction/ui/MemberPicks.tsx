import { cx } from '@trail/shared/design/ui-react';

export type MemberPick = {
  position: number;
  lastName: string;
  isOutsider: boolean;
  isWithdrawn: boolean;
};

export type MemberPicksProps = {
  pseudo: string;
  isMe: boolean;
  winnerTime: string;
  picks: MemberPick[];
};

export function MemberPicks({
  pseudo,
  isMe,
  winnerTime,
  picks,
}: MemberPicksProps) {
  return (
    <li
      className={cx(
        'border-ink shadow-block flex flex-col gap-2.5 rounded-[14px] border-2 p-3',
        isMe ? 'bg-highlight-soft' : 'bg-white',
      )}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className="text-base font-bold">
          {isMe ? `${pseudo} · toi` : pseudo}
        </span>
        <span className="text-muted flex items-center gap-1.5 text-xs">
          chrono
          <span className="bg-ink text-highlight font-display rounded-lg px-2 py-0.5 text-lg font-black tracking-wide">
            {winnerTime || '—'}
          </span>
        </span>
      </div>
      <ol className="m-0 grid list-none grid-cols-5 gap-1.5 p-0">
        {picks.map((pick) => (
          <li
            key={pick.position}
            className={cx(
              'flex min-w-0 flex-col items-center gap-px rounded-lg border-2 border-t-[5px] px-0.5 pt-1 pb-1.5',
              pick.isWithdrawn
                ? 'border-alert bg-alert-soft text-alert border-dashed'
                : 'border-ink border-t-primary',
              !pick.isWithdrawn &&
                (pick.isOutsider ? 'bg-highlight' : 'bg-white'),
            )}
          >
            <span className="font-display text-lg leading-none font-black">
              {pick.position}
            </span>
            <span
              className={cx(
                'max-w-full truncate text-[10px] font-bold uppercase',
                pick.isWithdrawn && 'line-through',
              )}
            >
              {pick.lastName || '—'}
            </span>
          </li>
        ))}
      </ol>
    </li>
  );
}
