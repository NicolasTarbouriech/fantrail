import { Link } from 'react-router-dom';

import { formatDay } from '@trail/modules-frontend';
import { PlusIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  AdminNotice,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
  adminButtonClasses,
} from '@trail/shared/design/ui-react-admin';

import { paths } from '../../app/paths';
import { useRacesPageQuery } from '../../services/graphql';
import { RaceStatusBadge } from './raceStatusBadge';

export function RacesPage() {
  const { data, loading, error } = useRacesPageQuery();

  return (
    <>
      <AdminPageHeader
        title="Courses"
        description="Brouillon → Ouverte → Verrouillée → Notée. Une course s’ouvre quand chaque champ a assez de coureurs."
        actions={
          <Link to={paths.newRace} className={adminButtonClasses('primary')}>
            <PlusIcon size={16} />
            Nouvelle course
          </Link>
        }
      />
      {loading && !data ? <Spinner /> : null}
      {error ? (
        <AdminNotice tone="danger">
          Impossible de charger les courses.
        </AdminNotice>
      ) : null}
      {data ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Course</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh className="text-right">Champs</AdminTh>
              <AdminTh className="text-right">Coureurs actifs</AdminTh>
            </tr>
          </thead>
          <tbody>
            {data.adminRaces.length === 0 ? (
              <tr>
                <AdminTd colSpan={5} className="text-center text-zinc-500">
                  Aucune course pour l’instant.
                </AdminTd>
              </tr>
            ) : null}
            {data.adminRaces.map((race) => {
              const firstStart = race.fields
                .map((field) => field.startAt)
                .sort()[0];
              const runnerCount = race.fields.reduce(
                (sum, field) =>
                  sum +
                  field.startList.runners.filter(
                    (runner) => !runner.isWithdrawn,
                  ).length,
                0,
              );
              return (
                <tr key={race.id} className="hover:bg-zinc-50">
                  <AdminTd className="min-w-56">
                    <Link
                      to={paths.race(race.id)}
                      className="flex flex-col no-underline"
                    >
                      <span className="font-semibold">{race.name}</span>
                      <span className="text-xs text-zinc-500">
                        {race.location} · {race.distanceInKm} km
                      </span>
                    </Link>
                  </AdminTd>
                  <AdminTd className="whitespace-nowrap">
                    {firstStart ? formatDay(firstStart, race.timezone) : '—'}
                  </AdminTd>
                  <AdminTd>
                    <RaceStatusBadge status={race.status} />
                  </AdminTd>
                  <AdminTd className="text-right tabular-nums">
                    {race.fields.length}
                  </AdminTd>
                  <AdminTd className="text-right tabular-nums">
                    {runnerCount}
                  </AdminTd>
                </tr>
              );
            })}
          </tbody>
        </AdminTable>
      ) : null}
    </>
  );
}
