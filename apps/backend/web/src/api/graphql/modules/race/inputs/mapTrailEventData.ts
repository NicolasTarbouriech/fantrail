import { GraphQLError } from 'graphql';

import { TrailEventData, TrailEventLogo } from '@trail/modules/race/domain';

import { TrailEventInput } from './TrailEventInput';

const BASE64_DATA_URL = /^data:([\w.+-]+\/[\w.+-]+);base64,([A-Za-z0-9+/=]+)$/;

// The format and the size are checked by the domain, this only decodes the transport encoding.
function mapLogo(dataUrl: string): TrailEventLogo {
  const [, contentType = '', payload = ''] =
    BASE64_DATA_URL.exec(dataUrl) ?? [];
  if (!contentType || !payload) {
    throw new GraphQLError('The logo must be a base64 data URL', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return { contentType, bytes: Buffer.from(payload, 'base64') };
}

export function mapTrailEventData(input: TrailEventInput): TrailEventData {
  return {
    name: input.name,
    logo: input.logoDataUrl ? mapLogo(input.logoDataUrl) : null,
  };
}
