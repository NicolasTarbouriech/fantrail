import type { ReactNode } from 'react';

import { cx } from './cx';

export type BibTone = 'primary' | 'ink' | 'alert' | 'gold' | 'faded';

const TONE_CLASSES: Record<BibTone, string> = {
  primary: 'border-t-primary bg-ground text-ink',
  ink: 'border-t-ink bg-ground text-ink',
  alert: 'border-t-alert bg-white text-alert',
  gold: 'border-t-highlight bg-ink text-highlight',
  faded: 'border-t-faded bg-white text-muted',
};

export type BibProps = {
  tone?: BibTone;
  children: ReactNode;
  className?: string;
};

export function Bib({ tone = 'primary', children, className }: BibProps) {
  return (
    <span
      className={cx(
        'font-display flex h-[42px] w-11 shrink-0 items-center justify-center rounded-lg border-t-[6px] text-[28px] font-black',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
