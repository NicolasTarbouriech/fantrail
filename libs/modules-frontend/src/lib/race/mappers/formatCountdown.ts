const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatCountdown(targetIso: string, now: Date): string {
  const remaining = new Date(targetIso).getTime() - now.getTime();
  if (remaining < MINUTE) {
    return '< 1 MIN';
  }
  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);
  const minutes = Math.floor((remaining % HOUR) / MINUTE);
  if (days > 0) {
    return hours > 0 ? `${days} J ${hours} H` : `${days} J`;
  }
  if (hours > 0) {
    return `${hours} H ${String(minutes).padStart(2, '0')}`;
  }
  return `${minutes} MIN`;
}
