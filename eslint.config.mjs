import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

const eslintConfig = compat.config({
  extends: ["next/core-web-vitals", "next/typescript"],
});

export default eslintConfig;
