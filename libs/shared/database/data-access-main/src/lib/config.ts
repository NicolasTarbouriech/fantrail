import { bool, integer, str } from '@trail/shared/tooling/util-environment';

export const DATABASE_HOST = str('DATABASE_HOST', 'localhost');
export const DATABASE_PORT = integer('DATABASE_PORT', 5433);
export const DATABASE_USERNAME = str('DATABASE_USERNAME', 'postgres');
export const DATABASE_PASSWORD = str('DATABASE_PASSWORD', 'postgres');
export const DATABASE_NAME = str('DATABASE_NAME', 'fantrail');
export const DATABASE_RUN_MIGRATIONS = bool('DATABASE_RUN_MIGRATIONS', true);
export const DATABASE_SSL_ENABLED = bool('DATABASE_SSL_ENABLED', false);
