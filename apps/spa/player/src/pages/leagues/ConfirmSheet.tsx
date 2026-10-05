import type { ReactNode } from 'react';

import { Button, Sheet } from '@trail/shared/design/ui-react';

export type ConfirmSheetProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  isPending: boolean;
  error: string | null;
  children: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmSheet({
  open,
  title,
  confirmLabel,
  isPending,
  error,
  children,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  return (
    <Sheet open={open} title={title} onClose={onClose}>
      <div className="text-sm leading-snug">{children}</div>
      {error ? (
        <p role="alert" className="text-alert m-0 text-sm font-semibold">
          {error}
        </p>
      ) : null}
      <div className="mt-1 flex flex-col gap-2.5">
        <Button
          variant="danger"
          size="lg"
          block
          onClick={onConfirm}
          disabled={isPending}
        >
          {confirmLabel}
        </Button>
        <Button
          variant="outline"
          size="lg"
          block
          className="text-[15px]"
          onClick={onClose}
        >
          Annuler
        </Button>
      </div>
    </Sheet>
  );
}
