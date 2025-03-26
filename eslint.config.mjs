import globals from "globals";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs", // For Node.js CommonJS (require/module.exports)
      globals: {
        ...globals.node, // Enable Node.js globals like require, module, etc.
      },
    },
    plugins: {
      import: importPlugin, // Add the import plugin
    },
    rules: {
      ...js.configs.recommended.rules, // Include recommended JS rules
      "no-undef": "error", // Catch undefined variables/functions like findById
      "import/no-unresolved": "error", // Ensure imports resolve correctly
      "no-constant-condition": "off", // Disable entirely
      "no-unused-vars": "off",
      "no-unsafe-optional-chaining": "off"
    },
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  },
];