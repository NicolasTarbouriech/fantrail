import { z } from 'zod';

import { TrailEventAggregate } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListTrailEventsQueryInput = z.object({});
export type ListTrailEventsQueryInput = z.infer<
  typeof ListTrailEventsQueryInput
>;

export class ListTrailEventsQuery extends Query<TrailEventAggregate[]> {
  public readonly input: ListTrailEventsQueryInput;

  constructor(input: ListTrailEventsQueryInput = {}) {
    super();
    this.input = ListTrailEventsQueryInput.parse(input);
  }
}
