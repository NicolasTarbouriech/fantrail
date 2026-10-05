import { ApolloError } from '@apollo/client';

/** `extensions.code` set by the API from the domain error name, e.g. `RACE_STATUS_TRANSITION`. */
export function getErrorCode(error: unknown): string | null {
  if (!(error instanceof ApolloError)) {
    return null;
  }
  const code = error.graphQLErrors[0]?.extensions?.['code'];
  return typeof code === 'string' ? code : null;
}

export function getErrorMessage(
  error: unknown,
  messages: Record<string, string>,
  fallback = 'Une erreur est survenue, réessaie.',
): string {
  const code = getErrorCode(error);
  return (code && messages[code]) || fallback;
}
