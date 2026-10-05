import { getRaceShortName } from '@trail/modules-frontend';
import { PillTabs } from '@trail/shared/design/ui-react';

export type RaceTabsProps = {
  races: Array<{ id: string; name: string }>;
  selectedRaceId: string | null;
  onSelect: (raceId: string | null) => void;
};

export function RaceTabs({ races, selectedRaceId, onSelect }: RaceTabsProps) {
  return (
    <PillTabs
      label="Classement"
      tabs={[
        {
          id: 'cumul',
          label: 'Cumul',
          selected: selectedRaceId === null,
          onSelect: () => onSelect(null),
        },
        ...races.map((race) => ({
          id: race.id,
          label: (
            <span className="truncate px-1">{getRaceShortName(race.name)}</span>
          ),
          selected: race.id === selectedRaceId,
          onSelect: () => onSelect(race.id),
        })),
      ]}
    />
  );
}
