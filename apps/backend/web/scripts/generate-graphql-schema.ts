import { generateSchema } from '@trail/shared/graphql/util-generator';

import { GRAPHQL_SCHEMA_DESTINATION } from '../src/api/graphql/constant';
import { resolvers } from '../src/api/graphql/resolvers';

generateSchema({
  destinationFile: GRAPHQL_SCHEMA_DESTINATION,
  resolverList: resolvers,
});
