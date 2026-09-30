import { z } from 'zod';

import {
  IndexSource,
  Runner,
  StartListAggregate,
} from '@trail/modules/race/domain';
import { RunnerEntity } from '@trail/shared/database/data-access-main';

function mapRunner(entity: RunnerEntity): Runner {
  return Runner.create(
    entity.id,
    {
      firstName: entity.first_name,
      lastName: entity.last_name,
      nationality: entity.nationality,
      index: entity.index,
      indexSource:
        entity.index_source === null
          ? null
          : z.nativeEnum(IndexSource).parse(entity.index_source),
      utmbUrl: entity.utmb_url,
      itraUrl: entity.itra_url,
    },
    entity.withdrawn_at,
  );
}

export function mapStartListAggregate(
  fieldId: string,
  entityList: RunnerEntity[],
): StartListAggregate {
  const sorted = [...entityList].sort((a, b) => a.position - b.position);
  return new StartListAggregate(fieldId, sorted.map(mapRunner));
}
