import { Bib, Tag, cx } from '@trail/shared/design/ui-react';

import { formatPoints } from '../../league/mappers';

export type ScorePickRowProps = {
  position: number;
  runnerName: string;
  description: string;
  points: number;
  isExact: boolean;
  isWithdrawn: boolean;
};

export function ScorePickRow({
  position,
  runnerName,
  description,
  points,
  isExact,
  isWithdrawn,
}: ScorePickRowProps) {
  return (
    <li
      className={cx(
        'flex min-h-14 items-center gap-3 rounded-[14px] border-2 py-1.5 pr-3.5 pl-1.5',
        isWithdrawn
          ? 'border-alert bg-alert-soft border-dashed'
          : 'border-ink shadow-block bg-white',
      )}
    >
      <Bib tone={isWithdrawn ? 'alert' : 'primary'}>{position}</Bib>
      <span className="flex min-w-0 grow flex-col">
        <span
          className={cx(
            'truncate text-[15px] font-bold uppercase',
            isWithdrawn && 'line-through',
          )}
        >
          {runnerName}
        </span>
        <span
          className={cx(
            'text-xs',
            isWithdrawn ? 'text-alert font-bold' : 'text-muted',
          )}
        >
          {description}
        </span>
      </span>
      {isExact ? <Tag tone="highlight">Exact</Tag> : null}
      <span className="font-display text-2xl font-black">
        {formatPoints(points)}
      </span>
    </li>
  );
}
