import { QueryFailedError } from 'typeorm';

const UNIQUE_VIOLATION_CODE = '23505';

export function isUniqueViolation(
  error: unknown,
  constraint?: string,
): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }
  const driverError: unknown = error.driverError;
  if (typeof driverError !== 'object' || driverError === null) {
    return false;
  }
  const code = 'code' in driverError ? driverError.code : undefined;
  const name = 'constraint' in driverError ? driverError.constraint : undefined;
  return (
    code === UNIQUE_VIOLATION_CODE &&
    (constraint === undefined || name === constraint)
  );
}
