import { useEffect, useState } from 'react';

/** Current date, refreshed every interval so countdowns and locks stay live. */
export function useNow(intervalInMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalInMs);
    return () => clearInterval(timer);
  }, [intervalInMs]);
  return now;
}
