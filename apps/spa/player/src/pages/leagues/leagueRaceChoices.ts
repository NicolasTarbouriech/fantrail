import {
  type RaceChoice,
  formatDay,
  getSelectableLeagueRaces,
} from '@trail/modules-frontend';
import type { RaceStatus } from '@trail/shared/apps/backend/web/data-access-graphql-types';

type RaceSource = {
  id: string;
  name: string;
  status: RaceStatus;
  fields: Array<{ startAt: string }>;
};

/** Race choices of a league form, with their first start as details. */
export function toLeagueRaceChoices(races: RaceSource[]): RaceChoice[] {
  return getSelectableLeagueRaces(races).map((race) => {
    const firstStart = race.fields.map((field) => field.startAt).sort()[0];
    return {
      id: race.id,
      name: race.name,
      details: firstStart ? formatDay(firstStart) : 'date à venir',
    };
  });
}
