import { DeepPartial } from 'typeorm';

import { StartListAggregate } from '@trail/modules/race/domain';
import { RunnerEntity } from '@trail/shared/database/data-access-main';

export function mapRunnerEntityList(
  startList: StartListAggregate,
): DeepPartial<RunnerEntity>[] {
  return startList.runnerList.map((runner, position) => ({
    id: runner.id,
    field_id: startList.fieldId,
    first_name: runner.data.firstName,
    last_name: runner.data.lastName,
    nationality: runner.data.nationality,
    index: runner.data.index,
    index_source: runner.data.indexSource,
    utmb_url: runner.data.utmbUrl,
    itra_url: runner.data.itraUrl,
    withdrawn_at: runner.withdrawnAt,
    position,
  }));
}
