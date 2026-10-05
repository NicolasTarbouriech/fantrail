import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function createApolloClient(): ApolloClient<unknown> {
  return new ApolloClient({
    link: new HttpLink({ uri: '/graphql', credentials: 'include' }),
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
