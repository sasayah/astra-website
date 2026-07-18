import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 旧サイト同様フルリロード遷移にするため Header/Footer は意図的に <a> を使用
      "@next/next/no-html-link-for-pages": "off",
      // 見た目1:1優先で旧テーマの <img> をそのまま利用（最適化は将来）
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 旧テーマから移植した第三者アセット（jQuery/slick等）とビルド用スクリプトは対象外
    "public/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
