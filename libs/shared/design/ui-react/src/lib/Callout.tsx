import type { ReactNode } from 'react';

import { cx } from './cx';
import { InfoIcon, WarningIcon } from './icons';

export type CalloutTone = 'info' | 'warning';

export type CalloutProps = {
  tone?: CalloutTone;
  children: ReactNode;
  className?: string;
};

export function Callout({ tone = 'info', children, className }: CalloutProps) {
  return (
    <div
      role={tone === 'warning' ? 'alert' : 'note'}
      className={cx(
        'flex gap-2.5 rounded-[14px] border-2 px-3.5 py-3 text-[13px] leading-snug',
        tone === 'info'
          ? 'border-ink bg-white'
          : 'border-alert bg-alert-soft border-dashed',
        className,
      )}
    >
      {tone === 'info' ? (
        <InfoIcon className="text-primary shrink-0" />
      ) : (
        <WarningIcon className="text-alert shrink-0" />
      )}
      <div className="grow">{children}</div>
    </div>
  );
}
