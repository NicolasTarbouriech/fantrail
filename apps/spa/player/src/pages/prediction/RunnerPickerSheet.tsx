import { type PickList, formatRank } from '@trail/modules-frontend';
import { Sheet } from '@trail/shared/design/ui-react';

import { RunnerPickerList, getActiveRunners } from './RunnerPickerList';
import type { PredictionRunner } from './predictionTypes';

export type RunnerPickerSheetProps = {
  position: number | null;
  fieldLabel: string;
  runners: PredictionRunner[];
  pickList: PickList;
  onPick: (runnerId: string) => void;
  onClose: () => void;
};

export function RunnerPickerSheet({
  position,
  fieldLabel,
  runners,
  pickList,
  onPick,
  onClose,
}: RunnerPickerSheetProps) {
  if (position === null) {
    return null;
  }
  return (
    <Sheet
      open
      onClose={onClose}
      title={`Choisis ton ${formatRank(position + 1)}`}
      subtitle={`${fieldLabel} · ${getActiveRunners(runners).length} coureurs`}
    >
      <RunnerPickerList
        position={position}
        runners={runners}
        pickList={pickList}
        onPick={onPick}
      />
    </Sheet>
  );
}
