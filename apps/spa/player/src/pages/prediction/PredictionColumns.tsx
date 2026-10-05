import type { ReactNode } from 'react';

import { cx } from '@trail/shared/design/ui-react';

export type PredictionColumnsProps = {
  aside?: ReactNode;
  children: ReactNode;
};

/** One readable column on phones and tablets, the start list beside it on desktop. */
export function PredictionColumns({ aside, children }: PredictionColumnsProps) {
  const hasAside = Boolean(aside);
  return (
    <div
      className={cx(
        'flex grow flex-col gap-3.5 md:gap-5',
        hasAside &&
          'lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8',
      )}
    >
      <div
        className={cx(
          'mx-auto flex w-full grow flex-col gap-3.5 md:max-w-2xl md:gap-5',
          hasAside && 'lg:max-w-none',
        )}
      >
        {children}
      </div>
      {aside}
    </div>
  );
}
