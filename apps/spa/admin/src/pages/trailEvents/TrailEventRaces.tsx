import { CloseIcon } from '@trail/shared/design/ui-react';
import { AdminSelect } from '@trail/shared/design/ui-react-admin';

export type TrailEventRacesRace = {
  id: string;
  name: string;
  trailEventId: string | null;
};

export type TrailEventRacesProps = {
  trailEventId: string;
  trailEventName: string;
  races: TrailEventRacesRace[];
  eventNameById: Map<string, string>;
  isPending: boolean;
  onChange: (raceId: string, trailEventId: string | null) => void;
};

/** The races of an event, each removable, and a select to add any other race. */
export function TrailEventRaces({
  trailEventId,
  trailEventName,
  races,
  eventNameById,
  isPending,
  onChange,
}: TrailEventRacesProps) {
  const members = races.filter((race) => race.trailEventId === trailEventId);
  const others = races.filter((race) => race.trailEventId !== trailEventId);
  return (
    <div className="flex flex-col gap-2">
      {members.length === 0 ? (
        <span className="text-zinc-500">Aucune course</span>
      ) : (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {members.map((race) => (
            <li
              key={race.id}
              className="flex h-7 items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 pr-0.5 pl-2 text-xs font-medium"
            >
              {race.name}
              <button
                type="button"
                disabled={isPending}
                aria-label={`Retirer ${race.name} de ${trailEventName}`}
                onClick={() => onChange(race.id, null)}
                className="flex size-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 disabled:cursor-default disabled:opacity-50"
              >
                <CloseIcon size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {others.length > 0 ? (
        <AdminSelect
          aria-label={`Ajouter une course à ${trailEventName}`}
          value=""
          disabled={isPending}
          onChange={(event) => {
            if (event.target.value) {
              onChange(event.target.value, trailEventId);
            }
          }}
          className="h-8 max-w-72 text-xs"
        >
          <option value="">Ajouter une course…</option>
          {others.map((race) => {
            const currentEvent = race.trailEventId
              ? eventNameById.get(race.trailEventId)
              : null;
            return (
              <option key={race.id} value={race.id}>
                {currentEvent
                  ? `${race.name} (dans ${currentEvent})`
                  : race.name}
              </option>
            );
          })}
        </AdminSelect>
      ) : null}
    </div>
  );
}
