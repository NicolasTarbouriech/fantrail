import { DomainError } from '@trail/shared/tooling/util-error';

import { RaceStatus } from '../enums';

export class RaceStatusTransitionError extends DomainError {
  constructor(
    public readonly from: RaceStatus,
    public readonly to: RaceStatus,
  ) {
    super(`Race cannot go from ${from} to ${to}`);
  }
}
