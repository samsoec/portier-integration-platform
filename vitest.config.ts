import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/**/__tests__/**",
        "app/mocks/**",
        "app/test-utils.tsx",
        "app/routes.ts",
        "app/root.tsx",
        // Exclude simple and exporting external modules
        "app/api/**",
        "app/providers/**",
        "app/routes/**",
      ],
      reporter: ["text", "html"],
      thresholds: {
        statements: -10,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
