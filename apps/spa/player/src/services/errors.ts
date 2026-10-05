import { ApolloError } from '@apollo/client';

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  USER_DISABLED: 'Ce compte est désactivé.',
  EMAIL_ALREADY_USED: 'Un compte existe déjà avec cet email.',
  PSEUDO_ALREADY_USED: 'Ce pseudo est déjà pris.',
  LEAGUE_NAME_ALREADY_USED: 'Une ligue porte déjà ce nom.',
  INVALID_INVITE_CODE: 'Ce code d’invitation ne marche pas.',
  LEAGUE_ALREADY_JOINED: 'Tu es déjà dans cette ligue.',
  LEAGUE_NOT_FOUND: 'Cette ligue n’existe pas ou plus.',
  LEAGUE_NOT_VISIBLE: 'Cette ligue est privée.',
  LEAGUE_OWNER_CANNOT_LEAVE: 'Le propriétaire ne peut pas quitter sa ligue.',
  PREDICTION_LOCKED: 'Trop tard : le départ est donné, les pronos sont figés.',
  FIELD_LOCKED: 'Trop tard : le départ est donné, les pronos sont figés.',
  WITHDRAWN_RUNNER_PICK: 'Ce coureur a été retiré de la start list.',
  DUPLICATE_PICK: 'Un coureur ne peut être choisi qu’une fois.',
};

const FALLBACK = 'Une erreur est survenue, réessaie.';

export function getErrorCode(error: unknown): string | null {
  if (!(error instanceof ApolloError)) {
    return null;
  }
  const code = error.graphQLErrors[0]?.extensions?.['code'];
  return typeof code === 'string' ? code : null;
}

export function getErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  return (code && MESSAGES[code]) || FALLBACK;
}
