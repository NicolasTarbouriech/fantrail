import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

/** Same-origin `/graphql`, so the httpOnly session cookie travels with every request. */
export function createApolloClient(uri = '/graphql'): ApolloClient<unknown> {
  return new ApolloClient({
    link: new HttpLink({ uri, credentials: 'include' }),
    cache: new InMemoryCache({
      typePolicies: {
        StartList: { keyFields: ['fieldId'] },
        Scorecard: { keyFields: ['fieldId'] },
        FieldResult: { keyFields: ['fieldId'] },
        LeaderboardEntry: { keyFields: false },
      },
    }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  });
}
