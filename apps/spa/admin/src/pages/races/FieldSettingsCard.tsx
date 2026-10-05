import { useState } from 'react';

import {
  formatCountdown,
  formatDayTime,
  fromRaceLocalInput,
  getFieldLabel,
  toRaceLocalInput,
} from '@trail/modules-frontend';
import type { Gender } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { LockIcon } from '@trail/shared/design/ui-react';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminField,
  AdminInput,
  AdminNotice,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRace, AdminField as RaceFieldType } from './raceTypes';

export type FieldSettingsCardProps = {
  race: AdminRace;
  gender: Gender;
  field: RaceFieldType | null;
  isEditable: boolean;
  isPending: boolean;
  error: string | null;
  onSave: (startAt: string, lockAt: string) => void;
  onLock: () => void;
};

export function FieldSettingsCard({
  race,
  gender,
  field,
  isEditable,
  isPending,
  error,
  onSave,
  onLock,
}: FieldSettingsCardProps) {
  const [startInput, setStartInput] = useState(
    field ? toRaceLocalInput(field.startAt, race.timezone) : '',
  );
  const [lockInput, setLockInput] = useState(
    field ? toRaceLocalInput(field.lockAt, race.timezone) : '',
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const save = () => {
    const startAt = fromRaceLocalInput(startInput, race.timezone);
    const lockAt = fromRaceLocalInput(lockInput || startInput, race.timezone);
    if (!startAt || !lockAt) {
      setLocalError('Renseigne la date et l’heure de départ.');
      return;
    }
    setLocalError(null);
    onSave(startAt, lockAt);
  };

  const isLocked = field?.isLocked ?? false;
  const state = !field
    ? null
    : isLocked
      ? `Verrouillé ${formatDayTime(field.lockedAt ?? field.lockAt, race.timezone)}`
      : `Ouvert · se verrouille dans ${formatCountdown(field.lockAt, new Date()).toLowerCase()}`;

  return (
    <AdminCard>
      <AdminCardHeader
        title={
          field
            ? getFieldLabel(gender)
            : `Ajouter le champ ${getFieldLabel(gender).toLowerCase()}`
        }
        description={`Heures de ${race.location} (${race.timezone}). Verrouille à la main si le départ est avancé.`}
      />
      <div className="grid items-start gap-4 md:grid-cols-[220px_220px_minmax(0,1fr)]">
        <AdminField id={`start-${gender}`} label="Départ">
          <AdminInput
            id={`start-${gender}`}
            type="datetime-local"
            disabled={!isEditable || isLocked}
            value={startInput}
            onChange={(event) => setStartInput(event.target.value)}
          />
        </AdminField>
        <AdminField
          id={`lock-${gender}`}
          label="Verrouillage des pronos"
          hint="Par défaut à l’heure du départ."
        >
          <AdminInput
            id={`lock-${gender}`}
            type="datetime-local"
            disabled={!isEditable || isLocked}
            value={lockInput}
            onChange={(event) => setLockInput(event.target.value)}
          />
        </AdminField>
        <div className="flex flex-wrap items-center justify-between gap-3 md:pt-[26px]">
          {state ? <span className="font-semibold">{state}</span> : <span />}
          {isEditable && !isLocked ? (
            <div className="flex gap-2">
              <AdminButton
                variant={field ? 'outline' : 'primary'}
                onClick={save}
                disabled={isPending}
              >
                {field ? 'Enregistrer' : 'Ajouter le champ'}
              </AdminButton>
              {field ? (
                <AdminButton
                  variant="dark"
                  onClick={onLock}
                  disabled={isPending}
                >
                  <LockIcon size={14} />
                  Verrouiller maintenant
                </AdminButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {localError || error ? (
        <AdminNotice tone="danger">{localError ?? error}</AdminNotice>
      ) : null}
    </AdminCard>
  );
}
