import { RaceStatus } from '@trail/modules/race/domain';
import {
  MEN_FIELD_ID,
  buildRaceAggregate,
} from '@trail/modules/race/domain-testing';
import { RaceEntity } from '@trail/shared/database/data-access-main';

import { mapRaceAggregate } from './mapRaceAggregate';
import { mapRaceEntity } from './mapRaceEntity';

describe('mapRaceAggregate', () => {
  it('maps back what mapRaceEntity wrote, fields sorted by gender', () => {
    const race = buildRaceAggregate({ status: RaceStatus.Open });
    race.lockField(MEN_FIELD_ID, new Date('2026-10-10T10:00:00Z'));
    const entity = mapRaceEntity(race) as RaceEntity;
    const mapped = mapRaceAggregate({
      ...entity,
      field_list: [...entity.field_list].reverse(),
    });
    expect(mapped.data).toEqual(race.data);
    expect(mapped.status).toBe(race.status);
    expect(mapped.fieldList).toEqual(race.fieldList);
  });

  it('maps a race whose fields are not loaded', () => {
    const entity = mapRaceEntity(buildRaceAggregate()) as RaceEntity;
    expect(
      mapRaceAggregate({
        ...entity,
        field_list: undefined,
      } as unknown as RaceEntity).fieldList,
    ).toEqual([]);
  });
});
