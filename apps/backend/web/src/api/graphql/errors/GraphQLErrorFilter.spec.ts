import { ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { GraphQLError } from 'graphql';

import { GraphQLErrorFilter } from './GraphQLErrorFilter';

const host = (type: string): ArgumentsHost =>
  ({ getType: () => type }) as unknown as ArgumentsHost;

describe('GraphQLErrorFilter', () => {
  const filter = new GraphQLErrorFilter();

  it('returns GraphQL errors unchanged', () => {
    const error = new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
    expect(filter.catch(error, host('graphql'))).toBe(error);
  });

  it('maps the rate limit to TOO_MANY_REQUESTS', () => {
    expect(
      filter.catch(new ThrottlerException(), host('graphql')).extensions[
        'code'
      ],
    ).toBe('TOO_MANY_REQUESTS');
  });

  it('leaves other transports alone', () => {
    expect(() => filter.catch(new ThrottlerException(), host('http'))).toThrow(
      ThrottlerException,
    );
  });
});
