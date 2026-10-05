const TIME_PATTERN = /^(\d{1,3})\s*[:hH]\s*(\d{1,2})$/;

/** "23:45" or "23h45" to seconds, null when the value is not a time. */
export function parseWinnerTime(value: string): number | null {
  const match = TIME_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (minutes > 59 || hours + minutes === 0) {
    return null;
  }
  return (hours * 60 + minutes) * 60;
}

export function formatWinnerTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) {
    return '';
  }
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(Math.abs(seconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  }
  return minutes === 0
    ? `${hours} h`
    : `${hours} h ${String(minutes).padStart(2, '0')}`;
}
