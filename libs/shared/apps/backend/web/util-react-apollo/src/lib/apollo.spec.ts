import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

import { createApolloClient } from './createApolloClient';
import { getErrorCode, getErrorMessage } from './getErrorCode';

describe('createApolloClient', () => {
  it('creates a client with a cache', () => {
    expect(createApolloClient().cache).toBeDefined();
  });
});

describe('getErrorCode', () => {
  const error = new ApolloError({
    graphQLErrors: [
      new GraphQLError('Locked', { extensions: { code: 'FIELD_LOCKED' } }),
    ],
  });

  it('reads the code of an API error', () => {
    expect(getErrorCode(error)).toBe('FIELD_LOCKED');
    expect(getErrorCode(new ApolloError({ graphQLErrors: [] }))).toBeNull();
    expect(getErrorCode(new Error('network'))).toBeNull();
  });

  it('maps the code to a message', () => {
    expect(getErrorMessage(error, { FIELD_LOCKED: 'Trop tard' })).toBe(
      'Trop tard',
    );
    expect(getErrorMessage(error, {}, 'Oups')).toBe('Oups');
    expect(getErrorMessage(error, {})).toBe(
      'Une erreur est survenue, réessaie.',
    );
  });
});
