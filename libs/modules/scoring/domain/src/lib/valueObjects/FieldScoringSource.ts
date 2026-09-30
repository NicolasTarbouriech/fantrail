import { z } from 'zod';

import {
  DurationInSeconds,
  FavoriteRank,
  FieldId,
  RunnerId,
  ScoringPrediction,
  ScoringResult,
  TimeTolerancePercent,
  UserId,
} from '../types';

export const ScoredPredictionData = ScoringPrediction.extend({
  userId: UserId,
  finalizedAt: z.date(),
});
export type ScoredPredictionData = z.infer<typeof ScoredPredictionData>;

export const FieldScoringSourceData = z.object({
  fieldId: FieldId,
  resultVersion: z.number().int().positive(),
  result: ScoringResult,
  timeTolerancePercent: TimeTolerancePercent,
  favoriteRankByRunnerId: z.record(RunnerId, FavoriteRank.nullable()),
  predictionList: z.array(ScoredPredictionData),
});
export type FieldScoringSourceData = z.infer<typeof FieldScoringSourceData>;

// Everything needed to score a field, gathered from the race, result and prediction modules.
export class FieldScoringSource {
  private constructor(private readonly _data: FieldScoringSourceData) {}

  static create(data: FieldScoringSourceData): FieldScoringSource {
    return new FieldScoringSource(FieldScoringSourceData.parse(data));
  }

  get fieldId(): FieldId {
    return this._data.fieldId;
  }

  get resultVersion(): number {
    return this._data.resultVersion;
  }

  get result(): ScoringResult {
    return this._data.result;
  }

  get winnerTimeInSeconds(): DurationInSeconds {
    return this._data.result.winnerTimeInSeconds;
  }

  get timeTolerancePercent(): number {
    return this._data.timeTolerancePercent;
  }

  get favoriteRankByRunnerId(): Record<RunnerId, number | null> {
    return this._data.favoriteRankByRunnerId;
  }

  get predictionList(): ScoredPredictionData[] {
    return this._data.predictionList;
  }
}
