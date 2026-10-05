import { AggregateRoot } from '@nestjs/cqrs';

import { toNameKey } from '@trail/shared/tooling/util-text';

import { TrailEventLogoAssertion } from '../assertions';
import { TrailEventData, TrailEventId, TrailEventLogo } from '../types';

/** A festival or a raid gathering several races, shown as a tag with its logo. */
export class TrailEventAggregate extends AggregateRoot {
  constructor(
    public readonly id: TrailEventId,
    private _data: TrailEventData,
  ) {
    super();
  }

  static assertData(data: TrailEventData): TrailEventData {
    const parsed = TrailEventData.parse(data);
    if (parsed.logo) {
      TrailEventLogoAssertion.assert(parsed.logo);
    }
    return parsed;
  }

  /** Names are unique regardless of case and accents. */
  static nameKey(name: string): string {
    return toNameKey(name);
  }

  get data(): TrailEventData {
    return this._data;
  }

  get name(): string {
    return this._data.name;
  }

  get logo(): TrailEventLogo | null {
    return this._data.logo;
  }

  update(data: TrailEventData): void {
    this._data = TrailEventAggregate.assertData(data);
  }
}
