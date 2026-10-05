import { RaceId } from '../types';

/** Port on the race module: the races a league may cover. */
export abstract class LeagueRaceRepository {
  abstract listAvailableRaceIds(): Promise<RaceId[]>;
}
