import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import globals from "globals";
import prettier from "eslint-plugin-prettier";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      typescriptEslint: tseslint.plugin,
      prettier,
			unicorn: eslintPluginUnicorn,
		},
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended      
    ],
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
			globals: globals.builtin,
      parser: tseslint.parser,
      parserOptions: {
        project: "./**/tsconfig.json",
        
      }
		},
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "prettier/prettier": "error",
      "no-debugger": "off",
      "no-console": "error",
      "class-methods-use-this": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { "assertionStyle": "never" }
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { "accessibility": "explicit", "overrides": { "constructors": "off" } }
      ],
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/await-thenable": "error",
      "unicorn/better-regex": "error",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-null": "off",
      "unicorn/number-literal-case": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          "allowList": {
            "acc": true,
            "env": true,
            "i": true,
            "j": true,
            "props": true,
            "Props": true
          }
        }
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
