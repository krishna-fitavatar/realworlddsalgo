import { defineConfig } from 'vitest/config';

// Unit tests target pure modules: the algorithm step-generators and the
// integrity-check logic. They do not import `astro:content`, so a plain
// vitest config (no Astro Vite plugin) keeps the run fast and isolated.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
