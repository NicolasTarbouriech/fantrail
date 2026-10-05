import type { TagTone } from '@trail/shared/design/ui-react';

import { type PickList, countPicks } from './pickList';

export type PredictionStatusSource = {
  isLocked: boolean;
  pickCount: number;
  pickList: PickList | null;
  winnerTimeInSeconds: number | null;
  withdrawnCount: number;
};

export type PredictionStatusTag = {
  label: string;
  tone: TagTone;
  isComplete: boolean;
};

export function getPredictionStatusTag({
  isLocked,
  pickCount,
  pickList,
  winnerTimeInSeconds,
  withdrawnCount,
}: PredictionStatusSource): PredictionStatusTag {
  const filled = pickList ? countPicks(pickList) : 0;
  const isComplete = filled === pickCount && winnerTimeInSeconds !== null;
  if (isLocked) {
    return isComplete
      ? { label: 'Verrouillé', tone: 'soft', isComplete }
      : { label: 'Incomplet · 0 pt', tone: 'alert', isComplete };
  }
  if (withdrawnCount > 0) {
    const withdrawn =
      withdrawnCount > 1 ? `${withdrawnCount} retirés` : '1 retiré';
    return {
      label: `${filled}/${pickCount} · ${withdrawn}`,
      tone: 'alert',
      isComplete,
    };
  }
  if (isComplete) {
    return { label: 'Complet', tone: 'primary', isComplete };
  }
  if (filled === 0 && winnerTimeInSeconds === null) {
    return { label: 'À faire', tone: 'dashed', isComplete };
  }
  if (filled === pickCount) {
    return { label: 'Chrono à saisir', tone: 'outline', isComplete };
  }
  return { label: `${filled}/${pickCount}`, tone: 'outline', isComplete };
}

export function getMissingPickHint(
  pickCount: number,
  pickList: PickList,
  winnerTimeInSeconds: number | null,
): string | null {
  const missing = pickCount - countPicks(pickList);
  if (missing > 1) {
    return `Encore ${missing} coureurs et ton prono compte`;
  }
  if (missing === 1) {
    return 'Encore un coureur et ton prono compte';
  }
  if (winnerTimeInSeconds === null) {
    return 'Saisis le chrono du vainqueur et ton prono compte';
  }
  return null;
}
