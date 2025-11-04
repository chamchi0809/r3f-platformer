import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import { readFileSync } from "fs";
import tseslint from "typescript-eslint";

const gitignorePatterns = readFileSync(".gitignore", "utf-8")
  .split("\n")
  .filter(line => line && !line.startsWith("#"));

export default defineConfig([
  stylistic.configs.recommended,
  {
    rules: {
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  { ignores: gitignorePatterns },
]);
