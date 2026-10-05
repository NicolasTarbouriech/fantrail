import type { ReactNode } from 'react';

export type AdminPageHeaderProps = {
  title: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  badge,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-2xl font-bold tracking-tight text-zinc-950">
            {title}
          </h1>
          {badge}
        </div>
        {description ? (
          <p className="m-0 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
