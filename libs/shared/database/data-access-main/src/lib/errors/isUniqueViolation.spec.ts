import { QueryFailedError } from 'typeorm';

import { isUniqueViolation } from './isUniqueViolation';

const queryFailed = (driverError: object): QueryFailedError =>
  new QueryFailedError(
    'INSERT',
    [],
    Object.assign(new Error('failed'), driverError),
  );

describe('isUniqueViolation', () => {
  it('detects a unique violation, optionally on a given constraint', () => {
    const error = queryFailed({ code: '23505', constraint: 'UQ_users_email' });
    expect(isUniqueViolation(error)).toBe(true);
    expect(isUniqueViolation(error, 'UQ_users_email')).toBe(true);
    expect(isUniqueViolation(error, 'UQ_users_pseudo_key')).toBe(false);
  });

  it('ignores other errors', () => {
    expect(isUniqueViolation(new Error('boom'))).toBe(false);
    expect(isUniqueViolation(queryFailed({ code: '23503' }))).toBe(false);
  });
});
