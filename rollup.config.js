import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/main.cjs",
      format: "cjs",
    },
    {
      file: "dist/module.mjs",
      format: "esm",
    },
  ],
  plugins: [typescript()],
  external: ["react", "react/jsx-runtime"],
});
