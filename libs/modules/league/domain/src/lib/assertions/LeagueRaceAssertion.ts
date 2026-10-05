import { LeagueRaceNotAvailableError, LeagueWithoutRaceError } from '../errors';
import { RaceId } from '../types';

export class LeagueRaceAssertion {
  /** A league covers at least one race, each one a race players can predict or follow. */
  static assertSelection(
    raceIdList: RaceId[],
    availableRaceIdList: RaceId[],
  ): RaceId[] {
    const selection = [...new Set(raceIdList)];
    if (selection.length === 0) {
      throw new LeagueWithoutRaceError();
    }
    const unavailable = selection.find(
      (raceId) => !availableRaceIdList.includes(raceId),
    );
    if (unavailable) {
      throw new LeagueRaceNotAvailableError(unavailable);
    }
    return selection;
  }
}
