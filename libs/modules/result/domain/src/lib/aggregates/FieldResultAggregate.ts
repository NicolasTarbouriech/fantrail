import { AggregateRoot } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { FieldResultAssertion } from '../assertions';
import { FieldResultNotPublishedError } from '../errors';
import {
  FieldResultPublishedEvent,
  FieldResultPublishedNestEvent,
  ResultEventName,
} from '../events';
import { FieldId, FieldResultData } from '../types';
import { ResultField } from '../valueObjects';

// Every publication, first one or correction, adds a version and triggers a full rescoring.
export class FieldResultAggregate extends AggregateRoot {
  constructor(
    public readonly fieldId: FieldId,
    private _version: number,
    private _data: FieldResultData | null,
    private _publishedAt: Date | null,
  ) {
    super();
  }

  static assertData(data: FieldResultData): FieldResultData {
    return FieldResultData.parse(data);
  }

  get version(): number {
    return this._version;
  }

  get isPublished(): boolean {
    return this._data !== null;
  }

  get data(): FieldResultData {
    if (!this._data) {
      throw new FieldResultNotPublishedError();
    }
    return this._data;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  publishResult(data: FieldResultData, field: ResultField, now: Date): void {
    field.assertLocked();
    const parsed = FieldResultAggregate.assertData(data);
    FieldResultAssertion.assert(parsed, field);
    this._version += 1;
    this._data = parsed;
    this._publishedAt = now;
    this.apply(
      new FieldResultPublishedNestEvent(
        FieldResultPublishedEvent.parse({
          eventId: randomUUID(),
          timestamp: now.getTime(),
          name: ResultEventName.FieldResultPublished,
          payload: { fieldId: this.fieldId, version: this._version },
        }),
      ),
    );
  }
}
