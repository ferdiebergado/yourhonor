/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

import { CSP_NONCE_PLACEHOLDER } from "./src/shared/constants";

const dirname = import.meta.dirname;

const env = loadEnv("testing", process.cwd(), "");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      react(),
      isProduction && babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@client": resolve(dirname, "./src/client"),
        "@server": resolve(dirname, "./src/server"),
        "@shared": resolve(dirname, "./src/shared"),
      },
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/server/**/*.{test,spec}.ts", "src/shared/**/*.{test,spec}.ts"],
            environment: "node",
            env,
          },
        },
        {
          extends: true,
          test: {
            name: "integration",
            include: ["tests/integration/**/*.{test,spec}.ts"],
            environment: "node",
            env,
          },
        },
      ],
    },
    html: {
      cspNonce: CSP_NONCE_PLACEHOLDER,
    },
  };
});
