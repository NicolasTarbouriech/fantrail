import type { ReactNode } from 'react';

import { CloseIcon, cx } from '@trail/shared/design/ui-react';

export type AdminDialogProps = {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  side?: 'center' | 'right';
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** Centered dialog, or a panel sliding from the right; full screen on phones. */
export function AdminDialog({
  open,
  title,
  description,
  footer,
  side = 'center',
  wide = false,
  onClose,
  children,
}: AdminDialogProps) {
  if (!open) {
    return null;
  }
  return (
    <div
      className={cx(
        'fixed inset-0 z-50 flex',
        side === 'center'
          ? 'items-end justify-center sm:items-center sm:p-6'
          : 'justify-end',
      )}
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-zinc-950/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'relative flex max-h-full w-full flex-col bg-white shadow-xl',
          side === 'center'
            ? cx(
                'max-h-[90vh] rounded-t-2xl sm:rounded-2xl sm:border sm:border-zinc-200',
                wide ? 'sm:max-w-3xl' : 'sm:max-w-lg',
              )
            : 'h-full border-l border-zinc-200 sm:max-w-[460px]',
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-6 pt-5 pb-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="m-0 text-lg font-semibold text-zinc-950">{title}</h2>
            {description ? (
              <p className="m-0 text-sm text-zinc-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-zinc-600 hover:bg-zinc-100"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="flex grow flex-col gap-4 overflow-y-auto px-6 py-5">
          {children}
        </div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-4 sm:rounded-b-2xl">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
