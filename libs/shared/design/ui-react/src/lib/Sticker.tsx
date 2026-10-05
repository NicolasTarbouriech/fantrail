import type { ReactNode } from 'react';

import { cx } from './cx';

export type StickerTone = 'highlight' | 'ink' | 'alert';

const TONE_CLASSES: Record<StickerTone, string> = {
  highlight: 'border-ink bg-highlight text-ink shadow-sticker',
  ink: 'border-ink bg-ink text-white shadow-[3px_3px_0_var(--color-highlight)]',
  alert: 'border-alert bg-alert-soft text-alert',
};

export type StickerProps = {
  tone?: StickerTone;
  tilt?: 'left' | 'right';
  children: ReactNode;
  className?: string;
};

export function Sticker({
  tone = 'highlight',
  tilt = 'left',
  children,
  className,
}: StickerProps) {
  return (
    <span
      className={cx(
        'font-display inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border-2 px-3 py-1 text-lg font-extrabold tracking-wide uppercase',
        tilt === 'left' ? '-rotate-3' : 'rotate-3',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
