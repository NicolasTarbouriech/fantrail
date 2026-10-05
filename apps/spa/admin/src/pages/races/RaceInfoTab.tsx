import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isRaceEditable } from '@trail/modules-frontend';
import {
  type RaceInput,
  RaceStatus,
} from '@trail/shared/apps/backend/web/data-access-graphql-types';
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
} from '@trail/shared/design/ui-react-admin';

import { paths } from '../../app/paths';
import { getErrorMessage } from '../../services/errors';
import {
  useRaceInfoTabMutateCancelMutation,
  useRaceInfoTabMutateCreateMutation,
  useRaceInfoTabMutateLockMutation,
  useRaceInfoTabMutateMarkScoredMutation,
  useRaceInfoTabMutateOpenMutation,
  useRaceInfoTabMutateUpdateMutation,
} from '../../services/graphql';
import { ConfirmDialog } from './ConfirmDialog';
import { RaceForm } from './RaceForm';
import { RaceStatusCard } from './RaceStatusCard';
import type { AdminRace } from './raceTypes';

type PendingAction = 'lock' | 'cancel' | null;

export function RaceInfoTab({ race }: { race: AdminRace | null }) {
  const navigate = useNavigate();
  const [create, createState] = useRaceInfoTabMutateCreateMutation({
    refetchQueries: ['RacesPage'],
  });
  const [update, updateState] = useRaceInfoTabMutateUpdateMutation();
  const [open, openState] = useRaceInfoTabMutateOpenMutation();
  const [lock, lockState] = useRaceInfoTabMutateLockMutation();
  const [markScored, markScoredState] =
    useRaceInfoTabMutateMarkScoredMutation();
  const [cancel, cancelState] = useRaceInfoTabMutateCancelMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const save = async (input: RaceInput) => {
    setFormError(null);
    setNotice(null);
    try {
      if (race) {
        await update({ variables: { raceId: race.id, data: input } });
        setNotice('Course enregistrée.');
      } else {
        const result = await create({ variables: { data: input } });
        if (result.data) {
          navigate(paths.race(result.data.createRace.id, 'champs'), {
            replace: true,
          });
        }
      }
    } catch (caught) {
      setFormError(getErrorMessage(caught));
    }
  };

  const run = async (action: () => Promise<unknown>) => {
    setStatusError(null);
    try {
      await action();
      setPending(null);
    } catch (caught) {
      setStatusError(getErrorMessage(caught));
    }
  };

  const isEditable = !race || isRaceEditable(race.status);
  const form = (
    <RaceForm
      key={race?.id ?? 'new'}
      race={race}
      isEditable={isEditable}
      isPickCountEditable={!race || race.status === RaceStatus.Draft}
      isSaving={createState.loading || updateState.loading}
      error={formError ?? notice}
      onSubmit={save}
    />
  );

  if (!race) {
    return <div className="max-w-3xl">{form}</div>;
  }

  const raceId = race.id;
  const canCancel =
    race.status !== RaceStatus.Scored && race.status !== RaceStatus.Cancelled;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      {form}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <RaceStatusCard
          race={race}
          isPending={openState.loading || markScoredState.loading}
          error={pending ? null : statusError}
          onOpen={() => run(() => open({ variables: { raceId } }))}
          onLock={() => setPending('lock')}
          onMarkScored={() => run(() => markScored({ variables: { raceId } }))}
        />
        {canCancel ? (
          <AdminCard tone="danger">
            <AdminCardHeader
              title="Annuler la course"
              description="Les pronos ne rapportent plus de points et la course sort des classements. Irréversible."
            />
            <AdminButton
              variant="destructive"
              className="justify-center"
              onClick={() => setPending('cancel')}
            >
              Annuler la course…
            </AdminButton>
          </AdminCard>
        ) : null}
      </div>
      <ConfirmDialog
        open={pending === 'lock'}
        title="Verrouiller toute la course ?"
        confirmLabel="Verrouiller maintenant"
        isPending={lockState.loading}
        error={statusError}
        onConfirm={() => run(() => lock({ variables: { raceId } }))}
        onClose={() => setPending(null)}
      >
        Tous les champs se verrouillent tout de suite : plus aucun joueur ne
        pourra modifier son prono, et les pronos deviennent visibles dans les
        ligues.
      </ConfirmDialog>
      <ConfirmDialog
        open={pending === 'cancel'}
        title={`Annuler ${race.name} ?`}
        confirmLabel="Annuler la course"
        tone="danger"
        isPending={cancelState.loading}
        error={statusError}
        onConfirm={() => run(() => cancel({ variables: { raceId } }))}
        onClose={() => setPending(null)}
      >
        Les joueurs verront la course grisée. Leurs pronos ne rapportent aucun
        point et la course sort de tous les classements. Cette action est
        définitive.
      </ConfirmDialog>
    </div>
  );
}
