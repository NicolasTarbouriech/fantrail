import { useState } from 'react';

import type { TrailEventInput } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { PlusIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  AdminButton,
  AdminNotice,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
} from '@trail/shared/design/ui-react-admin';

import { getErrorMessage } from '../../services/errors';
import {
  type TrailEventsPageTrailEventFragment,
  useTrailEventsPageMutateChangeRaceMutation,
  useTrailEventsPageMutateCreateMutation,
  useTrailEventsPageMutateDeleteMutation,
  useTrailEventsPageMutateUpdateMutation,
  useTrailEventsPageQuery,
} from '../../services/graphql';
import { ConfirmDialog } from '../races/ConfirmDialog';
import { TrailEventDialog } from './TrailEventDialog';
import { TrailEventRaces } from './TrailEventRaces';

type Editing = { trailEvent: TrailEventsPageTrailEventFragment | null };

export function TrailEventsPage() {
  const { data, loading, error } = useTrailEventsPageQuery();
  const [create, createState] = useTrailEventsPageMutateCreateMutation({
    refetchQueries: ['TrailEventsPage'],
  });
  const [update, updateState] = useTrailEventsPageMutateUpdateMutation();
  const [changeRace, changeRaceState] =
    useTrailEventsPageMutateChangeRaceMutation();
  const [deleteTrailEvent, deleteState] =
    useTrailEventsPageMutateDeleteMutation({
      refetchQueries: ['TrailEventsPage', 'RacesPage'],
    });
  const [editing, setEditing] = useState<Editing | null>(null);
  const [deleting, setDeleting] =
    useState<TrailEventsPageTrailEventFragment | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const raceNamesByEventId = new Map<string, string[]>();
  for (const race of data?.adminRaces ?? []) {
    if (race.trailEventId) {
      raceNamesByEventId.set(race.trailEventId, [
        ...(raceNamesByEventId.get(race.trailEventId) ?? []),
        race.name,
      ]);
    }
  }

  const eventNameById = new Map(
    (data?.trailEvents ?? []).map((trailEvent) => [
      trailEvent.id,
      trailEvent.name,
    ]),
  );

  const changeRaceTrailEvent = async (
    raceId: string,
    trailEventId: string | null,
  ) => {
    setActionError(null);
    try {
      await changeRace({ variables: { raceId, trailEventId } });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  };

  const save = async (input: TrailEventInput) => {
    setActionError(null);
    try {
      if (editing?.trailEvent) {
        await update({
          variables: { trailEventId: editing.trailEvent.id, data: input },
        });
      } else {
        await create({ variables: { data: input } });
      }
      setEditing(null);
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  };

  const confirmDelete = async () => {
    if (!deleting) {
      return;
    }
    setActionError(null);
    try {
      await deleteTrailEvent({ variables: { trailEventId: deleting.id } });
      setDeleting(null);
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    }
  };

  const deletingRaceCount = deleting
    ? (raceNamesByEventId.get(deleting.id)?.length ?? 0)
    : 0;

  return (
    <>
      <AdminPageHeader
        title="Événements"
        description="Un festival ou un raid regroupe plusieurs courses, affichées avec son tag et son logo."
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setActionError(null);
              setEditing({ trailEvent: null });
            }}
          >
            <PlusIcon size={16} />
            Nouvel événement
          </AdminButton>
        }
      />
      {loading && !data ? <Spinner /> : null}
      {actionError && !editing && !deleting ? (
        <AdminNotice tone="danger">{actionError}</AdminNotice>
      ) : null}
      {error ? (
        <AdminNotice tone="danger">
          Impossible de charger les événements.
        </AdminNotice>
      ) : null}
      {data ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh className="w-16">Logo</AdminTh>
              <AdminTh>Événement</AdminTh>
              <AdminTh>Courses</AdminTh>
              <AdminTh>
                <span className="sr-only">Actions</span>
              </AdminTh>
            </tr>
          </thead>
          <tbody>
            {data.trailEvents.length === 0 ? (
              <tr>
                <AdminTd colSpan={4} className="text-center text-zinc-500">
                  Aucun événement pour l’instant.
                </AdminTd>
              </tr>
            ) : null}
            {data.trailEvents.map((trailEvent) => (
              <tr key={trailEvent.id}>
                <AdminTd>
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white">
                    {trailEvent.logoUrl ? (
                      <img
                        src={trailEvent.logoUrl}
                        alt=""
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="text-[11px] text-zinc-400">—</span>
                    )}
                  </span>
                </AdminTd>
                <AdminTd className="font-semibold whitespace-nowrap">
                  {trailEvent.name}
                </AdminTd>
                <AdminTd className="min-w-72">
                  <TrailEventRaces
                    trailEventId={trailEvent.id}
                    trailEventName={trailEvent.name}
                    races={data.adminRaces}
                    eventNameById={eventNameById}
                    isPending={changeRaceState.loading}
                    onChange={changeRaceTrailEvent}
                  />
                </AdminTd>
                <AdminTd>
                  <span className="flex justify-end gap-2">
                    <AdminButton
                      size="sm"
                      onClick={() => {
                        setActionError(null);
                        setEditing({ trailEvent });
                      }}
                    >
                      Modifier
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setActionError(null);
                        setDeleting(trailEvent);
                      }}
                    >
                      Supprimer
                    </AdminButton>
                  </span>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}
      {editing ? (
        <TrailEventDialog
          key={editing.trailEvent?.id ?? 'new'}
          trailEvent={editing.trailEvent}
          isSaving={createState.loading || updateState.loading}
          error={actionError}
          onSubmit={save}
          onClose={() => setEditing(null)}
        />
      ) : null}
      <ConfirmDialog
        open={deleting !== null}
        title={`Supprimer ${deleting?.name ?? ''} ?`}
        confirmLabel="Supprimer l’événement"
        tone="danger"
        isPending={deleteState.loading}
        error={actionError}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deletingRaceCount > 0
          ? `Ses ${deletingRaceCount} course${deletingRaceCount > 1 ? 's' : ''} restent, sans tag d’événement.`
          : 'Aucune course n’y est rattachée.'}
      </ConfirmDialog>
    </>
  );
}
