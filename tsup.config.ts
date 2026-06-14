import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", styles: "src/styles.css" },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom"],
  injectStyle: false,
});
