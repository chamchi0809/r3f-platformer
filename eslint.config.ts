import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import fs from "fs";

const gitignorePatterns = fs.readFileSync('.gitignore', 'utf-8')
.split('\n')
.filter(line => line && !line.startsWith("#"));

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    { ignores: gitignorePatterns },
]);