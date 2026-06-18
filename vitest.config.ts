import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    hookTimeout: 60000,
    setupFiles: ['./tests/setup/env.ts'],
    testTimeout: 60000,
  },
})
