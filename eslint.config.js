import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".astro/**",
      ".venv/**",
      ".uv-cache/**",
      "dist/**",
      "node_modules/**",
      "package-lock.json",
      "uv.lock"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    plugins: {
      "jsx-a11y": jsxA11y
    },
    rules: {
      ...jsxA11y.configs.recommended.rules
    }
  },
  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.astro"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];
