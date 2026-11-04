import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Hashing passwords with bcrypt is slow on purpose
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Next.js handles this import itself. It only exists to stop browser code importing server code.
      'server-only': fileURLToPath(new URL('./tests/helpers/empty.ts', import.meta.url)),
    },
  },
})
