import {
  MEN_FIELD_ID,
  buildField,
  buildRunnerId,
  buildStartList,
} from '@trail/modules/race/domain-testing';
import { RunnerEntity } from '@trail/shared/database/data-access-main';

import { mapRunnerEntityList } from './mapRunnerEntityList';
import { mapStartListAggregate } from './mapStartListAggregate';

describe('mapStartListAggregate', () => {
  it('maps back what mapRunnerEntityList wrote, in position order', () => {
    const startList = buildStartList({ runnerCount: 3 });
    startList.withdrawRunner(
      buildRunnerId(2),
      buildField(),
      new Date('2026-10-10T10:00:00Z'),
    );
    const entityList = mapRunnerEntityList(startList) as RunnerEntity[];
    const mapped = mapStartListAggregate(
      MEN_FIELD_ID,
      [...entityList].reverse(),
    );
    expect(mapped.runnerList).toEqual(startList.runnerList);
  });

  it('maps a runner without index source', () => {
    const [entity] = mapRunnerEntityList(
      buildStartList({ runnerCount: 1 }),
    ) as RunnerEntity[];
    const mapped = mapStartListAggregate(MEN_FIELD_ID, [
      { ...entity, index_source: null },
    ]);
    expect(mapped.runnerList[0].data.indexSource).toBeNull();
  });
});
