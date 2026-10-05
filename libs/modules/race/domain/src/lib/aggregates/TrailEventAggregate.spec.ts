import { ZodError } from 'zod';

import { TRAIL_EVENT_LOGO_MAX_BYTES } from '../constants';
import { TrailEventLogoInvalidError } from '../errors';
import {
  buildTrailEventAggregate,
  buildTrailEventData,
  buildTrailEventLogo,
} from '../testing';
import { TrailEventAggregate } from './TrailEventAggregate';

describe('TrailEventAggregate', () => {
  it('exposes its name and logo', () => {
    const trailEvent = buildTrailEventAggregate();
    expect(trailEvent.name).toBe('Grand Raid');
    expect(trailEvent.logo?.contentType).toBe('image/png');
    expect(trailEvent.data.name).toBe('Grand Raid');
  });

  it('keys names regardless of case and accents', () => {
    expect(TrailEventAggregate.nameKey('  Festival des  TEMPLIÈRS ')).toBe(
      'festival des templiers',
    );
  });

  describe('update', () => {
    it('renames the event and drops its logo', () => {
      const trailEvent = buildTrailEventAggregate();
      trailEvent.update(
        buildTrailEventData({ name: ' Festival des Templiers ', logo: null }),
      );
      expect(trailEvent.name).toBe('Festival des Templiers');
      expect(trailEvent.logo).toBeNull();
    });

    it.each(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])(
      'accepts a %s logo',
      (contentType) => {
        const trailEvent = buildTrailEventAggregate();
        trailEvent.update(
          buildTrailEventData({ logo: buildTrailEventLogo({ contentType }) }),
        );
        expect(trailEvent.logo?.contentType).toBe(contentType);
      },
    );

    it.each([
      [
        'an unsupported format',
        buildTrailEventLogo({ contentType: 'image/gif' }),
      ],
      ['an empty file', buildTrailEventLogo({ bytes: new Uint8Array() })],
      [
        'a file over 100 KB',
        buildTrailEventLogo({
          bytes: new Uint8Array(TRAIL_EVENT_LOGO_MAX_BYTES + 1),
        }),
      ],
    ])('refuses %s', (_, logo) => {
      expect(() =>
        buildTrailEventAggregate().update(buildTrailEventData({ logo })),
      ).toThrow(TrailEventLogoInvalidError);
    });

    it('refuses a name too short or a logo without bytes', () => {
      expect(() =>
        buildTrailEventAggregate().update(buildTrailEventData({ name: 'G' })),
      ).toThrow(ZodError);
      expect(() =>
        TrailEventAggregate.assertData({
          name: 'Grand Raid',
          logo: { contentType: 'image/png', bytes: 'not bytes' },
        } as never),
      ).toThrow(ZodError);
    });
  });
});
