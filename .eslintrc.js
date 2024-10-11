/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/react"),
    require.resolve("@vercel/style-guide/eslint/next"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
  ],
  rules: {
    "import/no-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-named-as-default": "off",
    "unicorn/filename-case": "off",
    "eslint-comments/require-description": "off",
    "no-console": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
}
