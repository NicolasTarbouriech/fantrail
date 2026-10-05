import type { ReactNode } from 'react';

import { cx } from '@trail/shared/design/ui-react';

export type AdminBadgeTone =
  | 'neutral'
  | 'outline'
  | 'primary'
  | 'gold'
  | 'danger';

const TONE_CLASSES: Record<AdminBadgeTone, string> = {
  neutral: 'bg-zinc-100 text-zinc-800',
  outline: 'border border-zinc-200 bg-white text-zinc-600',
  primary: 'bg-primary-soft text-[#1e2bd6]',
  gold: 'bg-[#fff7cc] text-[#6b5800]',
  danger: 'bg-red-50 text-red-700',
};

export type AdminBadgeProps = {
  tone?: AdminBadgeTone;
  children: ReactNode;
};

export function AdminBadge({ tone = 'neutral', children }: AdminBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
