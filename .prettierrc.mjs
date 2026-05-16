export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 100,
  proseWrap: "always",
  trailingComma: "none",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
};
