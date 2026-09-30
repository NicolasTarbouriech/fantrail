import { DomainError } from '@trail/shared/tooling/util-error';

import { RaceStatus } from '../enums';

export class RaceNotEditableError extends DomainError {
  constructor(public readonly status: RaceStatus) {
    super(`Race cannot be edited in status ${status}`);
  }
}
