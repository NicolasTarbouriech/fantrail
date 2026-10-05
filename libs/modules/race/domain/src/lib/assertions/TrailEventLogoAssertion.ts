import {
  TRAIL_EVENT_LOGO_CONTENT_TYPE_LIST,
  TRAIL_EVENT_LOGO_MAX_BYTES,
} from '../constants';
import { TrailEventLogoInvalidError } from '../errors';
import { TrailEventLogo } from '../types';

export class TrailEventLogoAssertion {
  static assert({ contentType, bytes }: TrailEventLogo): void {
    if (
      !TRAIL_EVENT_LOGO_CONTENT_TYPE_LIST.some((type) => type === contentType)
    ) {
      throw new TrailEventLogoInvalidError(
        `${contentType} is not a PNG, JPEG, WebP or SVG image`,
      );
    }
    if (bytes.byteLength === 0) {
      throw new TrailEventLogoInvalidError('the file is empty');
    }
    if (bytes.byteLength > TRAIL_EVENT_LOGO_MAX_BYTES) {
      throw new TrailEventLogoInvalidError(
        `${Math.ceil(bytes.byteLength / 1024)} KB exceeds ${TRAIL_EVENT_LOGO_MAX_BYTES / 1024} KB`,
      );
    }
  }
}
