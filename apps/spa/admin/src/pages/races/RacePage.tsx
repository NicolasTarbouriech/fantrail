import { Link, NavLink, Navigate, useParams } from 'react-router-dom';

import { formatDay } from '@trail/modules-frontend';
import { ChevronRightIcon, Spinner } from '@trail/shared/design/ui-react';
import {
  ADMIN_SEGMENTED_GROUP_CLASSES,
  AdminNotice,
  AdminPageHeader,
  adminSegmentClasses,
} from '@trail/shared/design/ui-react-admin';

import { type RaceTab, paths } from '../../app/paths';
import { useRacePageQuery } from '../../services/graphql';
import { FieldsTab } from './FieldsTab';
import { RaceInfoTab } from './RaceInfoTab';
import { ResultsTab } from './ResultsTab';
import { RaceStatusBadge } from './raceStatusBadge';

const TABS: Array<{ id: RaceTab; label: string }> = [
  { id: 'infos', label: 'Infos' },
  { id: 'champs', label: 'Champs et start lists' },
  { id: 'resultats', label: 'Résultats' },
];

function isRaceTab(value: string | undefined): value is RaceTab {
  return TABS.some((tab) => tab.id === value);
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav
      aria-label="Fil d’Ariane"
      className="flex items-center gap-2 text-sm text-zinc-500"
    >
      <Link to={paths.races} className="no-underline hover:text-zinc-950">
        Courses
      </Link>
      <ChevronRightIcon size={14} />
      <span className="font-medium text-zinc-950">{name}</span>
    </nav>
  );
}

export function RacePage() {
  const { raceId, tab } = useParams();
  const { data, loading, error } = useRacePageQuery({
    variables: { raceId: raceId ?? '' },
    skip: !raceId,
  });

  if (!raceId) {
    return (
      <>
        <Breadcrumb name="Nouvelle course" />
        <AdminPageHeader
          title="Nouvelle course"
          description="Commence par les informations, tu ajouteras ensuite les champs et les start lists."
        />
        <RaceInfoTab race={null} />
      </>
    );
  }
  if (!isRaceTab(tab)) {
    return <Navigate to={paths.race(raceId)} replace />;
  }
  if (loading && !data) {
    return <Spinner />;
  }
  if (error || !data) {
    return <AdminNotice tone="danger">Course introuvable.</AdminNotice>;
  }

  const race = data.race;
  const firstStart = race.fields.map((field) => field.startAt).sort()[0];

  return (
    <>
      <Breadcrumb name={race.name} />
      <AdminPageHeader
        title={race.name}
        badge={<RaceStatusBadge status={race.status} />}
        description={[
          `${race.distanceInKm} km`,
          `${race.elevationGainInMeters.toLocaleString('fr-FR')} m D+`,
          firstStart ? formatDay(firstStart, race.timezone) : null,
          `${race.pickCount} picks`,
          `tolérance ${race.timeTolerancePercent} %`,
        ]
          .filter(Boolean)
          .join(' · ')}
      />
      <nav
        aria-label="Sections de la course"
        className={ADMIN_SEGMENTED_GROUP_CLASSES}
      >
        {TABS.map((item) => (
          <NavLink
            key={item.id}
            to={paths.race(race.id, item.id)}
            className={({ isActive }) => adminSegmentClasses(isActive)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      {tab === 'infos' ? <RaceInfoTab race={race} /> : null}
      {tab === 'champs' ? <FieldsTab race={race} /> : null}
      {tab === 'resultats' ? <ResultsTab race={race} /> : null}
    </>
  );
}
