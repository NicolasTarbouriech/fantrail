import { z } from 'zod';

import { PICK_WEIGHT_LIST, SCORED_POSITION_COUNT } from '../constants';
import { DurationInSeconds } from './DurationInSeconds';
import { FavoriteRank } from './FavoriteRank';
import { RunnerId } from './RunnerId';
import { TimeTolerancePercent } from './TimeTolerancePercent';

const distinct = (list: string[]): boolean =>
  new Set(list).size === list.length;

export const ScoringPrediction = z.object({
  pickList: z
    .array(RunnerId)
    .min(1)
    .max(PICK_WEIGHT_LIST.length)
    .refine(distinct, 'A runner can only be picked once'),
  winnerTimeEstimateInSeconds: DurationInSeconds,
});
export type ScoringPrediction = z.infer<typeof ScoringPrediction>;

export const ScoringResult = z.object({
  rankingList: z
    .array(RunnerId)
    .min(1)
    .max(SCORED_POSITION_COUNT)
    .refine(distinct, 'A runner can only be ranked once'),
  winnerTimeInSeconds: DurationInSeconds,
});
export type ScoringResult = z.infer<typeof ScoringResult>;

export const ScoringInput = z.object({
  prediction: ScoringPrediction,
  result: ScoringResult,
  favoriteRankByRunnerId: z.record(RunnerId, FavoriteRank.nullable()),
  timeTolerancePercent: TimeTolerancePercent,
});
export type ScoringInput = z.infer<typeof ScoringInput>;
