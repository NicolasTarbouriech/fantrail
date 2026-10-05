import type { PredictionPageQuery } from '../../services/graphql';

export type PredictionRace = PredictionPageQuery['race'];
export type PredictionField = PredictionRace['fields'][number];
export type PredictionRunner = PredictionField['startList']['runners'][number];
export type SavedPrediction = PredictionPageQuery['myPredictions'][number];
