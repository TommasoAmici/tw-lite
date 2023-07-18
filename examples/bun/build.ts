import { execSync } from "node:child_process";

console.time("tailwindcss");
execSync("bun tailwindcss -i ./src/index.css -o ./out/index.css");
console.timeEnd("tailwindcss");

console.time("bun build");
await Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "./out",
});
console.timeEnd("bun build");
