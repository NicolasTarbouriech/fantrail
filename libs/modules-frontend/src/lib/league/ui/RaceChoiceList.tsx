import { CheckIcon, cx } from '@trail/shared/design/ui-react';

export type RaceChoice = {
  id: string;
  name: string;
  details: string;
};

export type RaceChoiceListProps = {
  name: string;
  races: RaceChoice[];
  selectedIds: string[];
  onToggle: (raceId: string) => void;
};

export function RaceChoiceList({
  name,
  races,
  selectedIds,
  onToggle,
}: RaceChoiceListProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {races.map((race) => {
        const isSelected = selectedIds.includes(race.id);
        return (
          <label
            key={race.id}
            className={cx(
              'flex cursor-pointer items-center gap-3 rounded-[14px] border-2 p-3.5',
              isSelected
                ? 'border-ink bg-primary-soft shadow-block'
                : 'border-line-strong bg-white',
            )}
          >
            <input
              type="checkbox"
              name={name}
              value={race.id}
              checked={isSelected}
              onChange={() => onToggle(race.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={cx(
                'border-ink flex size-6 shrink-0 items-center justify-center rounded-md border-2',
                isSelected ? 'bg-primary text-white' : 'bg-white',
              )}
            >
              {isSelected ? <CheckIcon size={14} /> : null}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-display text-[22px] leading-none font-black uppercase">
                {race.name}
              </span>
              <span className="text-muted text-[13px]">{race.details}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** Toggles a race in a selection, keeping the original order. */
export function toggleRace(selectedIds: string[], raceId: string): string[] {
  return selectedIds.includes(raceId)
    ? selectedIds.filter((id) => id !== raceId)
    : [...selectedIds, raceId];
}
