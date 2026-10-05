import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'apps/backend/web/output/schema.graphql',
  generates: {
    'libs/shared/apps/backend/web/data-access-graphql-types/src/lib/generated/types.ts':
      {
        plugins: ['typescript'],
        config: {
          defaultScalarType: 'unknown',
          scalars: { DateTime: 'string' },
        },
      },
  },
};

export default config;
