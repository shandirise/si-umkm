// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Nonaktifkan aturan 'no-explicit-any' untuk sementara
      "@typescript-eslint/no-explicit-any": "off",
      // Nonaktifkan aturan 'no-unused-vars' untuk sementara
      "@typescript-eslint/no-unused-vars": "off",
      // Nonaktifkan aturan 'prefer-const' untuk sementara
      "prefer-const": "off",
      // Nonaktifkan peringatan penggunaan tag <img> (jika Anda tidak ingin menggunakan next/image sekarang)
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;