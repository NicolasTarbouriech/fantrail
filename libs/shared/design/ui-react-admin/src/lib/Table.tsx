import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cx } from '@trail/shared/design/ui-react';

/** Scrolls sideways on narrow screens instead of squeezing the columns. */
export function AdminTable({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table
        className={cx('w-full border-collapse text-sm', className)}
        {...props}
      />
    </div>
  );
}

export function AdminTh({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cx(
        'h-10 border-b border-zinc-200 bg-zinc-50 px-4 text-left text-[13px] font-medium whitespace-nowrap text-zinc-500',
        className,
      )}
      {...props}
    />
  );
}

export function AdminTd({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cx(
        'h-12 border-b border-zinc-100 px-4 text-zinc-950',
        className,
      )}
      {...props}
    />
  );
}
