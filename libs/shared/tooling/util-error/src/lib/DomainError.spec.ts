import { DomainError, NotFoundDomainError } from './DomainError';

class RaceStatusTransitionError extends DomainError {
  constructor() {
    super('Race cannot go from draft to scored');
  }
}

class RaceNotFoundError extends NotFoundDomainError {
  constructor() {
    super('Race not found');
  }
}

describe('DomainError', () => {
  it('derives its name and code from the class name', () => {
    const error = new RaceStatusTransitionError();
    expect(error.name).toBe('RaceStatusTransitionError');
    expect(error.code).toBe('RACE_STATUS_TRANSITION');
    expect(error.message).toBe('Race cannot go from draft to scored');
  });

  it('keeps the not found kind', () => {
    const error = new RaceNotFoundError();
    expect(error).toBeInstanceOf(NotFoundDomainError);
    expect(error.code).toBe('RACE_NOT_FOUND');
  });
});
