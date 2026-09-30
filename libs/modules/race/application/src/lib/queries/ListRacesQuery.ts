import { z } from 'zod';

import { RaceAggregate, RaceStatus } from '@trail/modules/race/domain';
import { Query } from '@trail/shared/cqrs/util-nestjs';

export const ListRacesQueryInput = z.object({
  statusList: z.array(z.nativeEnum(RaceStatus)).min(1).optional(),
});
export type ListRacesQueryInput = z.infer<typeof ListRacesQueryInput>;

export class ListRacesQuery extends Query<RaceAggregate[]> {
  public readonly input: ListRacesQueryInput;

  constructor(input: ListRacesQueryInput) {
    super();
    this.input = ListRacesQueryInput.parse(input);
  }
}
