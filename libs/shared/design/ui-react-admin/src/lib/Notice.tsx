import type { ReactNode } from 'react';

import { InfoIcon, WarningIcon, cx } from '@trail/shared/design/ui-react';

export type AdminNoticeProps = {
  tone?: 'info' | 'danger' | 'success';
  children: ReactNode;
};

export function AdminNotice({ tone = 'info', children }: AdminNoticeProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cx(
        'flex gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] leading-snug',
        tone === 'info' && 'border-zinc-200 bg-zinc-50 text-zinc-800',
        tone === 'danger' && 'border-red-200 bg-red-50 text-red-800',
        tone === 'success' && 'border-primary/20 bg-primary-soft text-zinc-900',
      )}
    >
      {tone === 'danger' ? (
        <WarningIcon size={16} className="mt-px shrink-0" />
      ) : (
        <InfoIcon size={16} className="text-primary mt-px shrink-0" />
      )}
      <div className="grow">{children}</div>
    </div>
  );
}
