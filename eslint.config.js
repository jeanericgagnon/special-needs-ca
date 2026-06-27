import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'frontend',
    'prototype_quarantine/**',
    'scratch/**',
    'data/**',
    'docs/**',
    'public/**',
    'node_modules/**',
  ]),
  {
    files: ['**/*.{js,mjs,jsx,cjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: [
      'scripts/**/*.mjs',
      'scripts/**/*.js',
      'src/scrapers/**/*.js',
      'src/db/**/*.js',
      'src/scratch/**/*.js',
      'src/pipeline/**/*.js',
      'src/server.js',
      'tests/**/*.js'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
])
