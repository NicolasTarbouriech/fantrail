import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@trail/shared/design/ui-react';

export type AdminCardProps = HTMLAttributes<HTMLElement> & {
  tone?: 'default' | 'danger';
};

export function AdminCard({
  tone = 'default',
  className,
  ...props
}: AdminCardProps) {
  return (
    <section
      className={cx(
        'flex flex-col gap-4 rounded-xl border bg-white p-5',
        tone === 'danger' ? 'border-red-200' : 'border-zinc-200',
        className,
      )}
      {...props}
    />
  );
}

export type AdminCardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function AdminCardHeader({
  title,
  description,
  action,
}: AdminCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 text-base font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="m-0 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
