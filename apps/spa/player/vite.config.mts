/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_URL = process.env['API_URL'] ?? 'http://localhost:3001';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/apps/spa/player',
  server: {
    port: 3000,
    host: 'localhost',
    // Same origin as the API in development, so the session cookie just works.
    proxy: { '/graphql': API_URL },
  },
  preview: {
    port: 3000,
    host: 'localhost',
    proxy: { '/graphql': API_URL },
  },
  plugins: [react(), tailwindcss(), nxViteTsPaths()],
  build: {
    outDir: '../../../dist/apps/spa/player',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
