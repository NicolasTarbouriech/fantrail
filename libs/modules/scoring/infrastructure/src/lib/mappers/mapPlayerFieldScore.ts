import { z } from 'zod';

import {
  Bonus,
  BonusType,
  FieldScore,
  PickScore,
  PlayerFieldScore,
  TimeScore,
} from '@trail/modules/scoring/domain';
import {
  FieldScoreBreakdown,
  FieldScoreEntity,
} from '@trail/shared/database/data-access-main';

export function mapPlayerFieldScore(
  entity: FieldScoreEntity,
): PlayerFieldScore {
  const { pickScoreList, timeScore, bonusList } = entity.breakdown;
  return new PlayerFieldScore(
    entity.user_id,
    entity.field_id,
    entity.result_version,
    new FieldScore(
      pickScoreList.map(
        (pick) =>
          new PickScore(
            pick.pickPosition,
            pick.runnerId,
            pick.finishPosition,
            pick.favoriteRank,
            pick.positionPoints,
            pick.multiplierInTenths,
            pick.points,
          ),
      ),
      new TimeScore(
        timeScore.estimateInSeconds,
        timeScore.actualInSeconds,
        timeScore.toleranceInSeconds,
        timeScore.points,
      ),
      bonusList.map(
        (bonus) =>
          new Bonus(z.nativeEnum(BonusType).parse(bonus.type), bonus.points),
      ),
    ),
    entity.finalized_at,
  );
}

export function mapFieldScoreEntity(score: PlayerFieldScore): FieldScoreEntity {
  const breakdown: FieldScoreBreakdown = {
    pickScoreList: score.fieldScore.pickScoreList.map((pick) => ({
      pickPosition: pick.pickPosition,
      runnerId: pick.runnerId,
      finishPosition: pick.finishPosition,
      favoriteRank: pick.favoriteRank,
      positionPoints: pick.positionPoints,
      multiplierInTenths: pick.multiplierInTenths,
      points: pick.points,
    })),
    timeScore: {
      estimateInSeconds: score.fieldScore.timeScore.estimateInSeconds,
      actualInSeconds: score.fieldScore.timeScore.actualInSeconds,
      toleranceInSeconds: score.fieldScore.timeScore.toleranceInSeconds,
      points: score.fieldScore.timeScore.points,
    },
    bonusList: score.fieldScore.bonusList.map((bonus) => ({
      type: bonus.type,
      points: bonus.points,
    })),
  };
  return Object.assign(new FieldScoreEntity(), {
    field_id: score.fieldId,
    user_id: score.userId,
    result_version: score.resultVersion,
    total: score.total,
    time_gap_in_seconds: score.timeGapInSeconds,
    finalized_at: score.finalizedAt,
    breakdown,
  });
}
