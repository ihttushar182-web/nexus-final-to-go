import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint (flat config, Build Spec §59 / §62).
 *
 * eslint-config-next v16 ships ready-to-use flat configs, so the legacy FlatCompat
 * bridge is no longer needed (it fails to serialise the plugin graph).
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      ".data/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Business logic lives outside components (§62); unused code should not ship.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
