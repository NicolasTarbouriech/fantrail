import { DomainError } from '@trail/shared/tooling/util-error';

import { Gender } from '../enums';

export class FieldGenderAlreadyExistsError extends DomainError {
  constructor(public readonly gender: Gender) {
    super(`Race already has a ${gender} field`);
  }
}
