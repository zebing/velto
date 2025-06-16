import { defineConfig } from 'vitest/config'

export default defineConfig({
  server: {
    hmr: false // 禁用 HMR
  },
  test: {
    include: ['**/__tests__/**/*.spec.ts'],
    environment: 'node',
  },
})