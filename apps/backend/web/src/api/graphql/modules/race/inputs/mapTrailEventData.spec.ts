import { GraphQLError } from 'graphql';

import { buildTrailEventAggregate } from '@trail/modules/race/domain-testing';

import { TrailEventType } from '../types/TrailEventType';
import { mapTrailEventData } from './mapTrailEventData';

describe('mapTrailEventData', () => {
  it('decodes a base64 data URL into the logo bytes', () => {
    const data = mapTrailEventData({
      name: 'Grand Raid',
      logoDataUrl: 'data:image/png;base64,iVBORw==',
    });
    expect(data.logo?.contentType).toBe('image/png');
    expect([...(data.logo?.bytes ?? [])]).toEqual([137, 80, 78, 71]);
  });

  it('keeps an event without logo', () => {
    expect(
      mapTrailEventData({ name: 'Grand Raid', logoDataUrl: null }).logo,
    ).toBeNull();
    expect(mapTrailEventData({ name: 'Grand Raid' }).logo).toBeNull();
  });

  it('refuses anything but a base64 data URL', () => {
    expect(() =>
      mapTrailEventData({
        name: 'Grand Raid',
        logoDataUrl: 'https://example.org/logo.png',
      }),
    ).toThrow(GraphQLError);
  });

  it('round-trips through TrailEventType', () => {
    expect(new TrailEventType(buildTrailEventAggregate()).logoUrl).toBe(
      'data:image/png;base64,iVBORw==',
    );
    expect(
      new TrailEventType(buildTrailEventAggregate({ data: { logo: null } }))
        .logoUrl,
    ).toBeNull();
  });
});
