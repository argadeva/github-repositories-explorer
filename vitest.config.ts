import { defineConfig, defaultExclude } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['setupTests.ts'],
    exclude: [
      'node_modules',
      'src/utils',
      'src/types',
      'src/main.tsx',
      '**/*.d.ts',
      '**/*.d.tsx',
      ...defaultExclude,
    ],
    coverage: {
      exclude: [
        'node_modules',
        'src/utils',
        'src/types',
        'src/main.tsx',
        '**/*.d.ts',
        '**/*.d.tsx',
        ...defaultExclude,
      ],
    },
  },
})
