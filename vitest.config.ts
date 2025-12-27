import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "server/**/*.spec.ts", "client/**/*.test.ts", "client/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["server/**/*.ts", "client/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.tsx",
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.ts",
      ],
    },
  },
});
