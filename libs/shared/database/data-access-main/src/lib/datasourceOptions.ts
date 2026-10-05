import { DataSourceOptions } from 'typeorm';

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_RUN_MIGRATIONS,
  DATABASE_SSL_ENABLED,
  DATABASE_USERNAME,
} from './config';
import * as entityList from './entities';
import * as migrationList from './migrations';

export const entities = Object.values(entityList);
export const migrations = Object.values(migrationList);

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  uuidExtension: 'pgcrypto',
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: DATABASE_SSL_ENABLED,
  extra: DATABASE_SSL_ENABLED
    ? { ssl: { rejectUnauthorized: false } }
    : undefined,
  migrationsRun: DATABASE_RUN_MIGRATIONS,
  // One transaction per migration, so that an index built CONCURRENTLY can opt out (transaction = false).
  migrationsTransactionMode: 'each',
  synchronize: false,
  logging: false,
  entities,
  migrations,
};
