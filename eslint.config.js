// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  {
    ignores: [
      "node_modules",
      "generated",
      "generated/prisma",
      ".prisma",
      "dist",
      "build",
      ".next"
    ]
  },

  {
    files: ['**/__tests__/**','app/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'react/display-name': 'off'
    }
  },

  globalIgnores([
    "**/__tests__/**",   // <-- add this
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
])