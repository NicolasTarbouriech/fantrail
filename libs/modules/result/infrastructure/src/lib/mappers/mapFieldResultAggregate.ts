import { FieldResultAggregate } from '@trail/modules/result/domain';
import { FieldResultEntity } from '@trail/shared/database/data-access-main';

export function mapFieldResultAggregate(
  fieldId: string,
  entity: FieldResultEntity | null,
): FieldResultAggregate {
  if (!entity) {
    return new FieldResultAggregate(fieldId, 0, null, null);
  }
  return new FieldResultAggregate(
    entity.field_id,
    entity.version,
    {
      rankingList: entity.ranking_list,
      winnerTimeInSeconds: entity.winner_time_in_seconds,
      dnfRunnerIdList: entity.dnf_runner_id_list,
    },
    entity.published_at,
  );
}
