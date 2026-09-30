import { ArgumentsHost } from '@nestjs/common';
import { ZodError, z } from 'zod';

import {
  RaceNotFoundError,
  RaceWithoutFieldError,
} from '@trail/modules/race/domain';

import { DomainErrorFilter } from './DomainErrorFilter';

const host = (type: string): ArgumentsHost =>
  ({ getType: () => type }) as unknown as ArgumentsHost;

describe('DomainErrorFilter', () => {
  const filter = new DomainErrorFilter();

  it('maps a business rule violation to its code', () => {
    const error = filter.catch(new RaceWithoutFieldError(), host('graphql'));
    expect(error.extensions).toEqual({
      code: 'RACE_WITHOUT_FIELD',
      kind: 'BUSINESS_RULE',
    });
  });

  it('marks not found errors', () => {
    expect(
      filter.catch(new RaceNotFoundError(), host('graphql')).extensions['kind'],
    ).toBe('NOT_FOUND');
  });

  it('maps a validation error to BAD_USER_INPUT with its issues', () => {
    const { error } = z.object({ name: z.string() }).safeParse({});
    const graphQLError = filter.catch(error as ZodError, host('graphql'));
    expect(graphQLError.extensions['code']).toBe('BAD_USER_INPUT');
    expect(graphQLError.extensions['issues']).toEqual([
      expect.objectContaining({ path: ['name'] }),
    ]);
  });

  it('leaves other transports alone', () => {
    expect(() =>
      filter.catch(new RaceWithoutFieldError(), host('http')),
    ).toThrow(RaceWithoutFieldError);
  });
});
