import { DomainError } from '@trail/shared/tooling/util-error';

export class LeagueWithoutRaceError extends DomainError {
  constructor() {
    super('A league covers at least one race');
  }
}
