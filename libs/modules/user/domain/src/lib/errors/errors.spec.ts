import {
  EmailAlreadyUsedError,
  InvalidCredentialsError,
  PseudoAlreadyUsedError,
  UserDisabledError,
  UserNotFoundError,
} from './index';

describe('user errors', () => {
  it.each([
    [new UserNotFoundError(), 'USER_NOT_FOUND'],
    [new EmailAlreadyUsedError(), 'EMAIL_ALREADY_USED'],
    [new PseudoAlreadyUsedError(), 'PSEUDO_ALREADY_USED'],
    [new InvalidCredentialsError(), 'INVALID_CREDENTIALS'],
    [new UserDisabledError(), 'USER_DISABLED'],
  ])('%p has code %s', (error, code) => {
    expect(error.code).toBe(code);
  });
});
