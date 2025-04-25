import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["src/**/*.test.tsx", "**/*.d.tsx"]), {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
    },

    rules: {
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",

        "@typescript-eslint/consistent-type-imports": ["error", {
            prefer: "type-imports",
            disallowTypeAnnotations: false,
        }],

        "prefer-const": "off",

        "no-console": ["error", {
            allow: ["warn", "error"],
        }],

        "no-unsafe-optional-chaining": "off",
        "no-explicit-any": "off",
        "no-extra-boolean-cast": "off",
        "no-prototype-builtins": "off",
        "no-useless-escape": "off",

        "no-restricted-imports": ["error", {
            paths: [{
                name: "lodash",
                message: "Import specific methods from `lodash`. e.g. `import map from 'lodash/map'`",
            }, {
                name: "lodash-es",
                importNames: ["default"],
                message: "Import specific methods from `lodash-es`. e.g. `import { map } from 'lodash-es'`",
            }, {
                name: "carbon-components-react",
                message: "Import from `@carbon/react` directly. e.g. `import { Toggle } from '@carbon/react'`",
            }, {
                name: "@carbon/icons-react",
                message: "Import from `@carbon/react/icons`. e.g. `import { ChevronUp } from '@carbon/react/icons'`",
            }],
        }],
    },
}]);