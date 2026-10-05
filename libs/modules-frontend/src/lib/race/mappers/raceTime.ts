import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

/** UTC instant to the `datetime-local` value an admin reads, in the race timezone. */
export function toRaceLocalInput(iso: string, timeZone: string): string {
  return formatInTimeZone(new Date(iso), timeZone, INPUT_FORMAT);
}

/** `datetime-local` value typed in the race timezone, back to an UTC instant. */
export function fromRaceLocalInput(
  value: string,
  timeZone: string,
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }
  return fromZonedTime(value, timeZone).toISOString();
}

export const RACE_TIMEZONE_OPTIONS = [
  { value: 'Europe/Paris', label: 'Europe/Paris (France métropolitaine)' },
  { value: 'Indian/Reunion', label: 'Indian/Reunion (La Réunion)' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich (Suisse)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (Italie)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (Espagne)' },
];
