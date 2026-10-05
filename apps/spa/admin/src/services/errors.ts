import {
  getErrorCode as readErrorCode,
  getErrorMessage as readErrorMessage,
} from '@trail/shared/apps/backend/web/util-react-apollo';

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
  USER_DISABLED: 'Ce compte est désactivé.',
  RACE_STATUS_TRANSITION:
    'Ce changement de statut n’est pas possible depuis le statut actuel.',
  RACE_NOT_EDITABLE:
    'La course n’est plus modifiable : elle est verrouillée, notée ou annulée.',
  RACE_WITHOUT_FIELD: 'Ajoute au moins un champ avant d’ouvrir la course.',
  FIELD_NOT_ENOUGH_RUNNERS:
    'Un champ n’a pas assez de coureurs actifs pour le nombre de picks.',
  FIELD_GENDER_ALREADY_EXISTS: 'Ce champ existe déjà pour cette course.',
  FIELD_LOCK_BEFORE_START:
    'Le verrouillage doit avoir lieu au plus tard au départ.',
  FIELD_LOCKED: 'Ce champ est verrouillé.',
  FIELD_NOT_LOCKED: 'Tous les champs doivent être verrouillés.',
  PICK_COUNT_LOCKED:
    'Le nombre de picks ne change plus une fois la course ouverte.',
  DUPLICATE_RANKED_RUNNER: 'Un coureur apparaît deux fois dans le classement.',
  RESULT_RUNNER_NOT_IN_FIELD:
    'Un coureur du classement n’est pas dans ce champ.',
  RESULT_FIELD_NOT_LOCKED:
    'Le champ doit être verrouillé avant de publier son résultat.',
  FIELD_RESULT_NOT_PUBLISHED:
    'Publie le résultat de chaque champ avant de marquer la course notée.',
  LEAGUE_NAME_ALREADY_USED: 'Une ligue porte déjà ce nom.',
  LEAGUE_OWNER_CANNOT_LEAVE:
    'Le propriétaire ne peut pas être retiré de sa ligue.',
};

export const getErrorCode = readErrorCode;

export function getErrorMessage(error: unknown): string {
  return readErrorMessage(error, MESSAGES);
}
