const LOCALE = 'fr-FR';

function formatParts(date: Date, timeZone?: string) {
  const day = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date);
  return { day, time };
}

export function formatDay(iso: string, timeZone?: string): string {
  return formatParts(new Date(iso), timeZone).day;
}

/** A race start date, YYYY-MM-DD, with its year. */
export function formatRaceDate(startDate: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${startDate}T00:00:00Z`));
}

export function formatDayTime(iso: string, timeZone?: string): string {
  const { day, time } = formatParts(new Date(iso), timeZone);
  return `${day} · ${time}`;
}

/** Player's local time, with the race local time when it differs. */
export function formatStartTime(
  iso: string,
  raceTimeZone: string,
  playerTimeZone?: string,
): string {
  const date = new Date(iso);
  const local = formatParts(date, playerTimeZone);
  const race = formatParts(date, raceTimeZone);
  const sameTime = local.day === race.day && local.time === race.time;
  return sameTime
    ? `${local.day} ${local.time}`
    : `${local.day} ${local.time} (${race.time} sur place)`;
}
