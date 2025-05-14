module.exports = {
  extends: ["next/core-web-vitals", "plugin:import/recommended", "plugin:import/typescript"],
  plugins: ["import"],
  rules: {
    // Enforce named exports over default exports
    "import/no-default-export": "warn",

    // Allow default exports only in specific files
    "import/no-default-export": [
      "warn",
      {
        allowList: ["app/layout.tsx", "app/page.tsx", "app/*/page.tsx", "app/*/layout.tsx", "middleware.ts"],
      },
    ],

    // Ensure all named imports correspond to a named export in the imported module
    "import/named": "error",

    // Ensure a default export is present when using default import
    "import/default": "error",

    // Prevent anonymous default exports
    "import/no-anonymous-default-export": "error",

    // Ensure all exports are used somewhere
    "import/no-unused-modules": [
      "warn",
      {
        unusedExports: true,
        ignoreExports: ["app/**/*.tsx", "components/**/*.tsx"],
      },
    ],

    // Enforce a convention in the order of import statements
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "object", "type"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    // Enforce consistent exports style (named vs default)
    "import/no-mutable-exports": "error",

    // Prevent importing the submodules of other modules
    "import/no-internal-modules": [
      "warn",
      {
        allow: ["@/components/**", "@/lib/**", "@/app/**", "@/context/**"],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
}
