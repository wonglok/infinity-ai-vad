import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

/**
 * Copies WASM binaries from @runanywhere npm packages into dist/assets/
 * for production builds.
 */
function copyWasmPlugin(): Plugin {
  return {
    name: "copy-wasm",
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve("dist");
      const assetsDir = path.join(outDir, "assets");
      fs.mkdirSync(assetsDir, { recursive: true });

      const llamacppWasm = path.resolve(
        "node_modules/@runanywhere/web-llamacpp/wasm",
      );
      const onnxWasm = path.resolve("node_modules/@runanywhere/web-onnx/wasm");

      if (fs.existsSync(llamacppWasm)) {
        for (const file of fs.readdirSync(llamacppWasm)) {
          fs.copyFileSync(
            path.join(llamacppWasm, file),
            path.join(assetsDir, file),
          );
        }
      }

      if (fs.existsSync(onnxWasm)) {
        const sherpaDir = path.join(onnxWasm, "sherpa");
        const sherpaOut = path.join(assetsDir, "sherpa");
        if (fs.existsSync(sherpaDir)) {
          fs.mkdirSync(sherpaOut, { recursive: true });
          for (const file of fs.readdirSync(sherpaDir)) {
            fs.copyFileSync(
              path.join(sherpaDir, file),
              path.join(sherpaOut, file),
            );
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyWasmPlugin()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  assetsInclude: ["**/*.wasm"],
  worker: { format: "es" },
  optimizeDeps: {
    exclude: ["@runanywhere/web-llamacpp", "@runanywhere/web-onnx"],
  },
});
