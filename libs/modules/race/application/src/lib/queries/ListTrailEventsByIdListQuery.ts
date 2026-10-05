import { z } from 'zod';

import { TrailEventAggregate, TrailEventId } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListTrailEventsByIdListQueryInput = z.object({
  trailEventIdList: z.array(TrailEventId),
});
export type ListTrailEventsByIdListQueryInput = z.infer<
  typeof ListTrailEventsByIdListQueryInput
>;

export class ListTrailEventsByIdListQuery extends Query<TrailEventAggregate[]> {
  public readonly input: ListTrailEventsByIdListQueryInput;

  constructor(input: ListTrailEventsByIdListQueryInput) {
    super();
    this.input = ListTrailEventsByIdListQueryInput.parse(input);
  }
}
