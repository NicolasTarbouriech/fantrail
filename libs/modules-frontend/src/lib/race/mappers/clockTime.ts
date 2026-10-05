/** "23:32:00" or "23:32" to seconds, null when the value is not a duration. */
export function parseClockTime(value: string): number | null {
  const match = /^(\d{1,3}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const [hours, minutes, seconds] = [match[1], match[2], match[3] ?? '0'].map(
    Number,
  );
  if (minutes > 59 || seconds > 59) {
    return null;
  }
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

/**
 * Keeps the digits and places the colons from the right: the iOS numeric
 * keypad has no ":" key, so "2345" must read "23:45".
 */
export function maskClockTime(value: string, partCount: 2 | 3): string {
  let rest = value.replace(/\D/g, '').slice(0, 1 + partCount * 2);
  const tail: string[] = [];
  while (tail.length < partCount - 1 && rest.length > 2) {
    tail.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  return [rest, ...tail].join(':');
}

export function formatClockTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}
