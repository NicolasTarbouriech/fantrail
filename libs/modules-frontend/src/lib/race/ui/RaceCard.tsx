import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  ChevronRightIcon,
  InfoIcon,
  Sticker,
  type StickerTone,
  cx,
} from '@trail/shared/design/ui-react';

import { TrailEventTag, type TrailEventTagProps } from './TrailEventTag';

export type RaceCardTone = 'primary' | 'ink' | 'cancelled';

export type RaceCardRow = {
  id: string;
  label: string;
  to: string;
  trailing: ReactNode;
};

export type RaceCardProps = {
  tone: RaceCardTone;
  trailEvent?: Pick<TrailEventTagProps, 'name' | 'logoUrl'> | null;
  title: string;
  subtitle: string;
  sticker?: { label: ReactNode; tone: StickerTone };
  rows: RaceCardRow[];
  notice?: ReactNode;
  footer?: { label: string; to: string };
};

export function RaceCard({
  tone,
  trailEvent,
  title,
  subtitle,
  sticker,
  rows,
  notice,
  footer,
}: RaceCardProps) {
  const isCancelled = tone === 'cancelled';
  return (
    <article
      className={cx(
        'flex flex-col overflow-hidden rounded-[18px] border-2',
        isCancelled
          ? 'border-muted bg-disabled border-dashed'
          : 'border-ink shadow-block-lg bg-white',
      )}
    >
      <div
        className={cx(
          'flex grow items-start justify-between gap-3 px-4 pt-3.5 pb-4',
          tone === 'primary' && 'bg-primary text-white',
          tone === 'ink' && 'bg-ink text-white',
          isCancelled && 'border-muted text-muted border-b-2 border-dashed',
        )}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          {/* The slot is kept without event too, so that every card keeps the same height. */}
          <div className="mb-1.5 flex h-7 min-w-0">
            {trailEvent ? (
              <TrailEventTag
                name={trailEvent.name}
                logoUrl={trailEvent.logoUrl}
                className={cx(isCancelled && 'opacity-60')}
              />
            ) : null}
          </div>
          <h2
            className={cx(
              // Two lines reserved so that cards side by side keep the same height.
              'font-display m-0 min-h-[2em] text-[28px] leading-none font-black uppercase',
              isCancelled && 'line-through',
            )}
          >
            {title}
          </h2>
          <span
            className={cx(
              'text-[13px]',
              tone === 'primary' && 'text-on-primary',
              tone === 'ink' && 'text-on-ink',
            )}
          >
            {subtitle}
          </span>
        </div>
        {sticker ? (
          <Sticker tone={sticker.tone} tilt="right" className="text-base">
            {sticker.label}
          </Sticker>
        ) : null}
      </div>
      {notice ? (
        <div className="flex gap-2.5 px-4 py-3.5 text-[13px] leading-snug">
          <InfoIcon className="text-muted shrink-0" />
          <span>{notice}</span>
        </div>
      ) : null}
      {rows.map((row) => (
        <Link
          key={row.id}
          to={row.to}
          className="border-line text-ink flex h-14 items-center gap-3 border-b-2 px-4 no-underline last:border-b-0"
        >
          <span className="grow text-[15px] font-semibold">{row.label}</span>
          {row.trailing}
          <ChevronRightIcon size={18} />
        </Link>
      ))}
      {footer ? (
        <Link
          to={footer.to}
          className="bg-highlight text-ink font-display flex h-[52px] items-center justify-center gap-2 text-lg font-black tracking-wide uppercase no-underline"
        >
          {footer.label}
        </Link>
      ) : null}
    </article>
  );
}
