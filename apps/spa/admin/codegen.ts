import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'apps/backend/web/output/schema.graphql',
  documents: ['apps/spa/admin/src/**/*.graphql'],
  config: {
    defaultScalarType: 'unknown',
    scalars: { DateTime: 'string' },
  },
  generates: {
    'apps/spa/admin/src/services/generated/operations.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: '@trail/shared/apps/backend/web/data-access-graphql-types',
      },
      plugins: ['typescript-operations'],
      config: { preResolveTypes: true, avoidOptionals: { field: true } },
    },
    'apps/spa/admin/src/services/generated/hooks.ts': {
      preset: 'import-types',
      presetConfig: { typesPath: './operations' },
      plugins: ['typescript-react-apollo'],
      config: { withHooks: true },
    },
  },
};

export default config;
