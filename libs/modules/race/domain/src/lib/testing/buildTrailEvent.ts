import { TrailEventAggregate } from '../aggregates';
import { TrailEventData, TrailEventLogo } from '../types';

export const TRAIL_EVENT_ID = '55555555-5555-4555-8555-555555555555';

export function buildTrailEventLogo(
  overrides: Partial<TrailEventLogo> = {},
): TrailEventLogo {
  return {
    contentType: 'image/png',
    bytes: new Uint8Array([137, 80, 78, 71]),
    ...overrides,
  };
}

export function buildTrailEventData(
  overrides: Partial<TrailEventData> = {},
): TrailEventData {
  return {
    name: 'Grand Raid',
    logo: buildTrailEventLogo(),
    ...overrides,
  };
}

export function buildTrailEventAggregate({
  id = TRAIL_EVENT_ID,
  data = {},
}: { id?: string; data?: Partial<TrailEventData> } = {}): TrailEventAggregate {
  return new TrailEventAggregate(id, buildTrailEventData(data));
}
