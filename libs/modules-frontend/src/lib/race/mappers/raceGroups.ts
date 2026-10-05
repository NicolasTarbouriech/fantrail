export type GroupedTrailEvent = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type RaceGroup<TRace> = {
  trailEvent: GroupedTrailEvent | null;
  races: TRace[];
};

/**
 * Races of a same trail event side by side, events in the order of their first race,
 * races without event last. The order of the races inside a group is kept.
 */
export function groupRacesByTrailEvent<
  TRace extends { trailEvent: GroupedTrailEvent | null },
>(races: TRace[]): RaceGroup<TRace>[] {
  const groupByEventId = new Map<string, RaceGroup<TRace>>();
  const withoutEvent: TRace[] = [];
  for (const race of races) {
    if (!race.trailEvent) {
      withoutEvent.push(race);
      continue;
    }
    const group = groupByEventId.get(race.trailEvent.id) ?? {
      trailEvent: race.trailEvent,
      races: [],
    };
    group.races.push(race);
    groupByEventId.set(race.trailEvent.id, group);
  }
  const groups = [...groupByEventId.values()];
  return withoutEvent.length > 0
    ? [...groups, { trailEvent: null, races: withoutEvent }]
    : groups;
}
