import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default defineConfig([
  globalIgnores(['dist/', 'dist-subpath/', '.astro/', 'playwright-report/', 'test-results/']),
  tseslint.configs.recommended,
  astro.configs.recommended,
]);
