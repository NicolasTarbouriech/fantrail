import type { ReactNode } from 'react';

import { cx } from './cx';

export type TagTone =
  | 'outline'
  | 'dashed'
  | 'primary'
  | 'soft'
  | 'alert'
  | 'highlight'
  | 'ink';

const TONE_CLASSES: Record<TagTone, string> = {
  outline: 'border-2 border-ink bg-white text-ink',
  dashed: 'border-2 border-dashed border-ink text-ink',
  primary: 'border-2 border-ink bg-primary text-white',
  soft: 'border-2 border-ink bg-ground text-ink',
  alert: 'border-2 border-alert bg-alert-soft text-alert',
  highlight: 'border-2 border-ink bg-highlight text-ink',
  ink: 'border-2 border-ink bg-ink text-white',
};

export type TagProps = {
  tone?: TagTone;
  children: ReactNode;
  className?: string;
};

export function Tag({ tone = 'outline', children, className }: TagProps) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold uppercase',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
