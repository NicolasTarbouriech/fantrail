import { IEvent } from '@nestjs/cqrs';
import { z } from 'zod';

import { FieldId, RaceId } from '../types';

export enum RaceEventName {
  RaceDeleted = 'race-deleted',
}

export const RaceDeletedEvent = z.object({
  eventId: z.string().uuid(),
  timestamp: z.number().int().nonnegative(),
  name: z.literal(RaceEventName.RaceDeleted),
  payload: z.object({
    raceId: RaceId,
    fieldIdList: z.array(FieldId),
  }),
});
export type RaceDeletedEvent = z.infer<typeof RaceDeletedEvent>;

export class RaceDeletedNestEvent implements IEvent {
  constructor(public readonly event: RaceDeletedEvent) {}
}
