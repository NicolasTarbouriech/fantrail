import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';

export type LeagueRaceSource = {
  id: string;
  status: RaceStatus;
};

/** Races a league can cover: every public one, cancelled races left out. */
export function getSelectableLeagueRaces<T extends LeagueRaceSource>(
  races: T[],
): T[] {
  return races.filter((race) => race.status !== RaceStatus.Cancelled);
}

/** A new league starts with the races still open to predictions, or all of them. */
export function getDefaultLeagueRaceIds(races: LeagueRaceSource[]): string[] {
  const selectable = getSelectableLeagueRaces(races);
  const open = selectable.filter((race) => race.status === RaceStatus.Open);
  return (open.length > 0 ? open : selectable).map((race) => race.id);
}
