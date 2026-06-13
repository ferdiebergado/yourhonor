/// <reference types="vitest/config" />
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

import { CSP_NONCE_PLACEHOLDER } from './src/shared/constants';

const dirname = import.meta.dirname;

const alias = {
  '@client': resolve(dirname, './src/client'),
  '@server': resolve(dirname, './src/server'),
  '@shared': resolve(dirname, './src/shared'),
};

const env = loadEnv('testing', process.cwd(), '');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: {
    alias,
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/server/**/*.{test,spec}.ts'],
          alias,
          environment: 'node',
          env,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.{test,spec}.ts'],
          alias,
          environment: 'node',
          env,
        },
      },
    ],
  },
  html: {
    cspNonce: CSP_NONCE_PLACEHOLDER,
  },
});
