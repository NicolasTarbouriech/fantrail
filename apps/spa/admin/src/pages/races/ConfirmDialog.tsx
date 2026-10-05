import type { ReactNode } from 'react';

import {
  AdminButton,
  AdminDialog,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  tone?: 'primary' | 'danger';
  isPending: boolean;
  error: string | null;
  children: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  confirmLabel,
  tone = 'primary',
  isPending,
  error,
  children,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AdminDialog
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            Annuler
          </AdminButton>
          <AdminButton
            variant={tone === 'danger' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            disabled={isPending}
          >
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-zinc-700">{children}</div>
      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
    </AdminDialog>
  );
}
