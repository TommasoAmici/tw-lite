import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/main.js",
      format: "cjs",
    },
    {
      file: "dist/module.js",
      format: "esm",
    },
  ],
  plugins: [typescript()],
  external: ["react", "react/jsx-runtime"],
});
