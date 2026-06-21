import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedExtends = [unicorn.configs.recommended, prettier];

const unicornRelaxedRules = {
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/no-anonymous-default-export': 'off',
  'unicorn/filename-case': 'off',
};

export default defineConfig([
  globalIgnores(['dist', '.netlify']),
  {
    files: ['src/client/**'],
    ignores: ['src/components/ui/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended-strict'],
      sharedExtends,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: unicornRelaxedRules,
  },
  {
    files: ['src/server/**', 'src/shared/**', 'tests/integration/**', 'tests/helpers/**'],
    ignores: ['src/server/netlify/edge-functions/**'],
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked, sharedExtends],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: unicornRelaxedRules,
  },
  {
    files: ['src/server/netlify/edge-functions/**'],
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked, sharedExtends],
    languageOptions: {
      globals: { browser: true, es2024: true },
      parserOptions: {
        project: ['./tsconfig.edge.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'import-x': importX },
    rules: {
      ...unicornRelaxedRules,
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
  },
]);
