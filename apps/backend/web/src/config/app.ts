import { bool, integer, str } from '@trail/shared/tooling/util-environment';

export const PORT = integer('PORT', 3001);
export const COMMIT = str('__COMMIT', 'local');
export const GRAPHQL_PLAYGROUND = bool('GRAPHQL_PLAYGROUND', false);
export const CORS_ORIGIN_LIST = str(
  'CORS_ORIGIN_LIST',
  'http://localhost:4200,http://localhost:3000',
).split(',');
export const ADMIN_API_KEY = str('ADMIN_API_KEY', '');
