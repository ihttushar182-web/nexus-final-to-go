import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Test configuration (Build Spec §59).
 *
 * unit tests run in a plain Node environment: the domain logic in /lib, /data and
 * /lib/db is framework-independent on purpose, so it can be tested without a browser.
 * `server-only` is stubbed because it is a bundler marker, not runtime behaviour.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "server-only": new URL("./tests/stubs/server-only.ts", import.meta.url).pathname,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    restoreMocks: true,
    coverage: {
      include: ["lib/**", "data/**", "config/**"],
      exclude: ["lib/db/supabase.ts"],
    },
  },
});
