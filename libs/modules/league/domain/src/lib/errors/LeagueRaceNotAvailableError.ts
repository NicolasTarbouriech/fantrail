import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueRaceNotAvailableError extends DomainError {
  constructor(raceId: string) {
    super(`Race ${raceId} is not open to leagues`);
  }
}
