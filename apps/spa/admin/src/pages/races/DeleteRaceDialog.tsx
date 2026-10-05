import { useState } from 'react';

import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  AdminButton,
  AdminDialog,
  AdminField,
  AdminInput,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

export type DeleteRaceDialogProps = {
  open: boolean;
  raceName: string;
  status: RaceStatus;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

/** Players' data goes with the race: once they could predict, typing the name confirms it. */
export function DeleteRaceDialog({
  open,
  raceName,
  status,
  isPending,
  error,
  onConfirm,
  onClose,
}: DeleteRaceDialogProps) {
  const [typedName, setTypedName] = useState('');
  const needsTypedName = status !== RaceStatus.Draft;
  const canConfirm = !needsTypedName || typedName.trim() === raceName;

  return (
    <AdminDialog
      open={open}
      title={`Supprimer ${raceName} ?`}
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            Annuler
          </AdminButton>
          <AdminButton
            variant="destructive"
            onClick={onConfirm}
            disabled={!canConfirm || isPending}
          >
            Supprimer définitivement
          </AdminButton>
        </>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-zinc-700">
        La course disparaît avec ses champs, ses start lists, les pronos des
        joueurs, ses résultats et ses scores. Elle sort aussi des ligues qui la
        comptaient. Rien ne pourra être récupéré.
      </p>
      {needsTypedName ? (
        <AdminField
          id="delete-race-name"
          label={`Tape « ${raceName} » pour confirmer`}
        >
          <AdminInput
            id="delete-race-name"
            autoComplete="off"
            value={typedName}
            onChange={(event) => setTypedName(event.target.value)}
          />
        </AdminField>
      ) : null}
      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}
    </AdminDialog>
  );
}
