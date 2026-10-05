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

export function getPredictionByFieldId(
  predictionList: HomePrediction[],
): Map<string, HomePrediction> {
  return new Map(
    predictionList.map((prediction) => [prediction.fieldId, prediction]),
  );
}

/** A race becomes the player's own once they save a prediction on one of its fields. */
export function selectMyRaces(
  races: HomeRace[],
  predictionByFieldId: Map<string, HomePrediction>,
): HomeRace[] {
  return races.filter((race) =>
    race.fields.some((field) => predictionByFieldId.has(field.id)),
  );
}
