import type { RaceCardSource } from '@trail/modules-frontend';

import type { HomePageQuery } from '../../services/graphql';

export type HomeRace = HomePageQuery['races'][number];
export type HomeField = HomeRace['fields'][number];
export type HomePrediction = HomePageQuery['myPredictions'][number];

export function getRaceCardSource(race: HomeRace): RaceCardSource {
  return {
    status: race.status,
    fields: race.fields.map((field) => ({
      isLocked: field.isLocked,
      lockAt: field.lockAt,
      hasResult: Boolean(field.result),
    })),
  };
}
