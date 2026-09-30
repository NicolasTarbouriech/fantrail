import {
  PickSlotList,
  PredictionAggregate,
} from '@trail/modules/prediction/domain';
import { PredictionEntity } from '@trail/shared/database/data-access-main';

export function mapPredictionAggregate(
  entity: PredictionEntity,
): PredictionAggregate {
  return new PredictionAggregate(
    entity.id,
    entity.user_id,
    entity.field_id,
    PickSlotList.parse(entity.pick_list),
    entity.winner_time_estimate_in_seconds,
    entity.finalized_at,
    entity.updated_at,
  );
}
