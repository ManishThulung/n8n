import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/schema/index.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm"], // or cjs if you prefer
  target: "ES2022",
  dts: false,
});
