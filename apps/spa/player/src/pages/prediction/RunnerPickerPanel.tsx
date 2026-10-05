import { type PickList, formatRank } from '@trail/modules-frontend';
import { Heading } from '@trail/shared/design/ui-react';

import { RunnerPickerList, getActiveRunners } from './RunnerPickerList';
import type { PredictionRunner } from './predictionTypes';

export type RunnerPickerPanelProps = {
  position: number | null;
  fieldLabel: string;
  runners: PredictionRunner[];
  pickList: PickList;
  onPick: (runnerId: string) => void;
};

/** Desktop: the start list stays open next to the top 5. */
export function RunnerPickerPanel({
  position,
  fieldLabel,
  runners,
  pickList,
  onPick,
}: RunnerPickerPanelProps) {
  return (
    <aside
      aria-label="Start list"
      className="border-ink shadow-block-lg sticky top-[96px] flex max-h-[calc(100dvh-120px)] flex-col gap-3 rounded-[18px] border-2 bg-white p-4"
    >
      <div className="flex flex-col">
        <Heading className="text-[28px]">
          {position === null
            ? 'Start list'
            : `Choisis ton ${formatRank(position + 1)}`}
        </Heading>
        <span className="text-muted text-[13px]">
          {fieldLabel} · {getActiveRunners(runners).length} coureurs
          {position === null ? ' · touche une place pour la changer' : ''}
        </span>
      </div>
      <div className="-mx-1 flex flex-col gap-2 overflow-y-auto px-1 pb-1">
        <RunnerPickerList
          position={position}
          runners={runners}
          pickList={pickList}
          onPick={onPick}
        />
      </div>
    </aside>
  );
}
