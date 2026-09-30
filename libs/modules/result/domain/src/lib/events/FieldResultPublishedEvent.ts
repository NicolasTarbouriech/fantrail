import { IEvent } from '@nestjs/cqrs';
import { z } from 'zod';

import { FieldId } from '../types';

export enum ResultEventName {
  FieldResultPublished = 'field-result-published',
}

export const FieldResultPublishedEvent = z.object({
  eventId: z.string().uuid(),
  timestamp: z.number().int().nonnegative(),
  name: z.literal(ResultEventName.FieldResultPublished),
  payload: z.object({
    fieldId: FieldId,
    version: z.number().int().positive(),
  }),
});
export type FieldResultPublishedEvent = z.infer<
  typeof FieldResultPublishedEvent
>;

export class FieldResultPublishedNestEvent implements IEvent {
  constructor(public readonly event: FieldResultPublishedEvent) {}
}
