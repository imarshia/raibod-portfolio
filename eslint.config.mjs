// ESLint flat config for the Raibod local PoC.
// eslint-config-next 15 still ships legacy "extends" configs, so FlatCompat
// bridges them into ESLint 9 flat config. Added after the PoC (2026-11-07);
// the PoC shipped without any linter.
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts", "test-results/**"]),
]);
