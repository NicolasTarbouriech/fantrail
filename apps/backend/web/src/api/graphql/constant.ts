import { join } from 'path';

export const GRAPHQL_SCHEMA_DESTINATION = join(
  process.cwd(),
  'apps/backend/web/output/schema.graphql',
);
