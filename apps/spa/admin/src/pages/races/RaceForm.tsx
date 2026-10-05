import { type FormEvent, useState } from 'react';

import { RACE_TIMEZONE_OPTIONS } from '@trail/modules-frontend';
import type { RaceInput } from '@trail/shared/apps/backend/web/data-access-graphql-types';
import { cx } from '@trail/shared/design/ui-react';
import {
  ADMIN_SEGMENTED_GROUP_CLASSES,
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminField,
  AdminInput,
  AdminNotice,
  AdminSelect,
  adminSegmentClasses,
} from '@trail/shared/design/ui-react-admin';

import type { AdminRace } from './raceTypes';

type RaceFormValues = {
  name: string;
  startDate: string;
  location: string;
  timezone: string;
  distanceInKm: string;
  elevationGainInMeters: string;
  websiteUrl: string;
  liveTrailUrl: string;
  pickCount: number;
  timeTolerancePercent: string;
  trailEventId: string;
};

function toValues(race: AdminRace | null): RaceFormValues {
  return {
    name: race?.name ?? '',
    startDate: race?.startDate ?? '',
    location: race?.location ?? '',
    timezone: race?.timezone ?? 'Europe/Paris',
    distanceInKm: race ? String(race.distanceInKm) : '',
    elevationGainInMeters: race ? String(race.elevationGainInMeters) : '',
    websiteUrl: race?.websiteUrl ?? '',
    liveTrailUrl: race?.liveTrailUrl ?? '',
    pickCount: race?.pickCount ?? 5,
    timeTolerancePercent: race ? String(race.timeTolerancePercent) : '3',
    trailEventId: race?.trailEventId ?? '',
  };
}

function toInput(values: RaceFormValues): RaceInput | string {
  const distance = Number(values.distanceInKm.replace(',', '.'));
  const elevation = Number(values.elevationGainInMeters.replace(/\s/g, ''));
  const tolerance = Number(values.timeTolerancePercent.replace(',', '.'));
  if (!values.name.trim() || !values.location.trim()) {
    return 'Le nom et le lieu sont obligatoires.';
  }
  if (!values.startDate) {
    return 'La date de départ est obligatoire.';
  }
  if (!(distance > 0) || !Number.isInteger(elevation) || elevation < 0) {
    return 'Distance et dénivelé doivent être des nombres positifs.';
  }
  if (!(tolerance > 0)) {
    return 'La tolérance doit être un pourcentage positif.';
  }
  return {
    name: values.name.trim(),
    startDate: values.startDate,
    location: values.location.trim(),
    timezone: values.timezone,
    distanceInKm: distance,
    elevationGainInMeters: elevation,
    websiteUrl: values.websiteUrl.trim() || null,
    liveTrailUrl: values.liveTrailUrl.trim() || null,
    pickCount: values.pickCount,
    timeTolerancePercent: tolerance,
    trailEventId: values.trailEventId || null,
  };
}

export type RaceFormProps = {
  race: AdminRace | null;
  trailEventOptions: Array<{ id: string; name: string }>;
  isEditable: boolean;
  isPickCountEditable: boolean;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: RaceInput) => void;
};

export function RaceForm({
  race,
  trailEventOptions,
  isEditable,
  isPickCountEditable,
  isSaving,
  error,
  onSubmit,
}: RaceFormProps) {
  const [values, setValues] = useState(() => toValues(race));
  const [formError, setFormError] = useState<string | null>(null);
  const set = <K extends keyof RaceFormValues>(
    key: K,
    value: RaceFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const input = toInput(values);
    if (typeof input === 'string') {
      setFormError(input);
      return;
    }
    setFormError(null);
    onSubmit(input);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <AdminCard>
        <AdminCardHeader
          title="Informations"
          description="Affichées aux joueurs sur la carte et l’écran de pronostic."
        />
        <fieldset
          disabled={!isEditable}
          className="m-0 grid gap-4 border-0 p-0 sm:grid-cols-2"
        >
          <AdminField
            id="race-name"
            label="Nom"
            hint="Sans l’année : la date de départ distingue les éditions."
          >
            <AdminInput
              id="race-name"
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder="Grand Trail des Templiers"
            />
          </AdminField>
          <AdminField
            id="race-start-date"
            label="Date de départ"
            hint="Jour du départ, sur place."
          >
            <AdminInput
              id="race-start-date"
              type="date"
              value={values.startDate}
              onChange={(event) => set('startDate', event.target.value)}
              className="tabular-nums"
            />
          </AdminField>
          <AdminField
            id="race-trail-event"
            label="Événement"
            hint="Son tag et son logo s’affichent sur la carte de la course."
            className="sm:col-span-2"
          >
            <AdminSelect
              id="race-trail-event"
              value={values.trailEventId}
              onChange={(event) => set('trailEventId', event.target.value)}
            >
              <option value="">Aucun</option>
              {trailEventOptions.map((trailEvent) => (
                <option key={trailEvent.id} value={trailEvent.id}>
                  {trailEvent.name}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField id="race-location" label="Lieu">
            <AdminInput
              id="race-location"
              value={values.location}
              onChange={(event) => set('location', event.target.value)}
              placeholder="Millau"
            />
          </AdminField>
          <AdminField
            id="race-timezone"
            label="Fuseau horaire de la course"
            hint="Les heures de départ et de verrouillage se saisissent dans ce fuseau."
          >
            <AdminSelect
              id="race-timezone"
              value={values.timezone}
              onChange={(event) => set('timezone', event.target.value)}
            >
              {RACE_TIMEZONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField id="race-distance" label="Distance (km)">
            <AdminInput
              id="race-distance"
              inputMode="decimal"
              value={values.distanceInKm}
              onChange={(event) => set('distanceInKm', event.target.value)}
              className="tabular-nums"
            />
          </AdminField>
          <AdminField id="race-elevation" label="Dénivelé positif (m)">
            <AdminInput
              id="race-elevation"
              inputMode="numeric"
              value={values.elevationGainInMeters}
              onChange={(event) =>
                set('elevationGainInMeters', event.target.value)
              }
              className="tabular-nums"
            />
          </AdminField>
          <AdminField id="race-website" label="Site officiel">
            <AdminInput
              id="race-website"
              type="url"
              value={values.websiteUrl}
              onChange={(event) => set('websiteUrl', event.target.value)}
              placeholder="https://…"
            />
          </AdminField>
          <AdminField id="race-livetrail" label="Page LiveTrail">
            <AdminInput
              id="race-livetrail"
              type="url"
              value={values.liveTrailUrl}
              onChange={(event) => set('liveTrailUrl', event.target.value)}
              placeholder="https://livetrail.net/…"
            />
          </AdminField>
        </fieldset>
      </AdminCard>
      <AdminCard>
        <AdminCardHeader
          title="Règles du jeu"
          description="Le nombre de picks ne change plus une fois la course ouverte."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset
            disabled={!isPickCountEditable}
            className="m-0 flex flex-col gap-1.5 border-0 p-0"
          >
            <legend className="mb-1.5 p-0 text-sm font-medium">
              Nombre de picks
            </legend>
            <div
              role="group"
              className={cx(ADMIN_SEGMENTED_GROUP_CLASSES, 'self-start')}
            >
              {[3, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={values.pickCount === count}
                  onClick={() => set('pickCount', count)}
                  className={adminSegmentClasses(values.pickCount === count)}
                >
                  Top {count}
                </button>
              ))}
            </div>
          </fieldset>
          <AdminField
            id="race-tolerance"
            label="Tolérance du chrono (%)"
            hint="Écart au temps du vainqueur au-delà duquel le chrono vaut 0."
          >
            <div className="w-32">
              <AdminInput
                id="race-tolerance"
                inputMode="decimal"
                disabled={!isEditable}
                value={values.timeTolerancePercent}
                onChange={(event) =>
                  set('timeTolerancePercent', event.target.value)
                }
                className="tabular-nums"
              />
            </div>
          </AdminField>
        </div>
      </AdminCard>
      {formError || error ? (
        <AdminNotice tone="danger">{formError ?? error}</AdminNotice>
      ) : null}
      {isEditable ? (
        <div className="flex justify-end gap-2">
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => setValues(toValues(race))}
          >
            Annuler les changements
          </AdminButton>
          <AdminButton type="submit" variant="primary" disabled={isSaving}>
            {race ? 'Enregistrer' : 'Créer la course'}
          </AdminButton>
        </div>
      ) : null}
    </form>
  );
}
