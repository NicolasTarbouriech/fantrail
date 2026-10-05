import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';

export type RaceCardKind = 'open' | 'locked' | 'scored' | 'cancelled';

export type RaceCardSource = {
  status: RaceStatus;
  fields: Array<{ isLocked: boolean; lockAt: string; hasResult: boolean }>;
};

export function getRaceCardKind(race: RaceCardSource): RaceCardKind {
  if (race.status === RaceStatus.Cancelled) {
    return 'cancelled';
  }
  const hasFields = race.fields.length > 0;
  if (
    race.status === RaceStatus.Scored ||
    (hasFields && race.fields.every((field) => field.hasResult))
  ) {
    return 'scored';
  }
  if (
    race.status === RaceStatus.Locked ||
    (hasFields && race.fields.every((field) => field.isLocked))
  ) {
    return 'locked';
  }
  return 'open';
}

/** Next lock among the fields still open, for the countdown. */
export function getNextLockAt(race: {
  fields: Array<{ isLocked: boolean; lockAt: string }>;
}): string | null {
  const lockAtList = race.fields
    .filter((field) => !field.isLocked)
    .map((field) => field.lockAt)
    .sort();
  return lockAtList[0] ?? null;
}
