import { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';

const STATUS_LABELS: Record<RaceStatus, string> = {
  [RaceStatus.Draft]: 'Brouillon',
  [RaceStatus.Open]: 'Ouverte',
  [RaceStatus.Locked]: 'Verrouillée',
  [RaceStatus.Scored]: 'Notée',
  [RaceStatus.Cancelled]: 'Annulée',
};

export const RACE_STATUS_STEPS = [
  RaceStatus.Draft,
  RaceStatus.Open,
  RaceStatus.Locked,
  RaceStatus.Scored,
];

export function getRaceStatusLabel(status: RaceStatus): string {
  return STATUS_LABELS[status];
}

export type RaceNextStep = 'open' | 'lock' | 'markScored' | null;

export function getRaceNextStep(status: RaceStatus): RaceNextStep {
  switch (status) {
    case RaceStatus.Draft:
      return 'open';
    case RaceStatus.Open:
      return 'lock';
    case RaceStatus.Locked:
      return 'markScored';
    default:
      return null;
  }
}

export function isRaceEditable(status: RaceStatus): boolean {
  return status === RaceStatus.Draft || status === RaceStatus.Open;
}
