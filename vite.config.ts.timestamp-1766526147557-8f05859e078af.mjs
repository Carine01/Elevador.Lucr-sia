// vite.config.ts
import { jsxLocPlugin } from "file:///C:/Users/Carine/Downloads/Elevador.Lucr-sia-main%20(1)/Elevador.Lucr-sia-main/node_modules/.pnpm/@builder.io+vite-plugin-jsx_beeabc560eb58ad0d1679c13e618bdd0/node_modules/@builder.io/vite-plugin-jsx-loc/dist/index.js";
import tailwindcss from "file:///C:/Users/Carine/Downloads/Elevador.Lucr-sia-main%20(1)/Elevador.Lucr-sia-main/node_modules/.pnpm/@tailwindcss+vite@4.1.14_vi_e7bd5e13e8204c79679a5c1eac35dc42/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/Users/Carine/Downloads/Elevador.Lucr-sia-main%20(1)/Elevador.Lucr-sia-main/node_modules/.pnpm/@vitejs+plugin-react@5.0.4__abdf2c4f4f4a064757ba4599915e4484/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { defineConfig } from "file:///C:/Users/Carine/Downloads/Elevador.Lucr-sia-main%20(1)/Elevador.Lucr-sia-main/node_modules/.pnpm/vite@5.4.20_@types+node@24.7.0_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import { vitePluginManusRuntime } from "file:///C:/Users/Carine/Downloads/Elevador.Lucr-sia-main%20(1)/Elevador.Lucr-sia-main/node_modules/.pnpm/vite-plugin-manus-runtime@0.0.56/node_modules/vite-plugin-manus-runtime/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Carine\\Downloads\\Elevador.Lucr-sia-main (1)\\Elevador.Lucr-sia-main";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "client", "src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "shared"),
      "@assets": path.resolve(__vite_injected_original_dirname, "attached_assets")
    }
  },
  envDir: path.resolve(__vite_injected_original_dirname),
  root: path.resolve(__vite_injected_original_dirname, "client"),
  publicDir: path.resolve(__vite_injected_original_dirname, "client", "public"),
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxDYXJpbmVcXFxcRG93bmxvYWRzXFxcXEVsZXZhZG9yLkx1Y3Itc2lhLW1haW4gKDEpXFxcXEVsZXZhZG9yLkx1Y3Itc2lhLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXENhcmluZVxcXFxEb3dubG9hZHNcXFxcRWxldmFkb3IuTHVjci1zaWEtbWFpbiAoMSlcXFxcRWxldmFkb3IuTHVjci1zaWEtbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQ2FyaW5lL0Rvd25sb2Fkcy9FbGV2YWRvci5MdWNyLXNpYS1tYWluJTIwKDEpL0VsZXZhZG9yLkx1Y3Itc2lhLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBqc3hMb2NQbHVnaW4gfSBmcm9tIFwiQGJ1aWxkZXIuaW8vdml0ZS1wbHVnaW4tanN4LWxvY1wiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJub2RlOmZzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IHZpdGVQbHVnaW5NYW51c1J1bnRpbWUgfSBmcm9tIFwidml0ZS1wbHVnaW4tbWFudXMtcnVudGltZVwiO1xyXG5cclxuXHJcbmNvbnN0IHBsdWdpbnMgPSBbcmVhY3QoKSwgdGFpbHdpbmRjc3MoKSwganN4TG9jUGx1Z2luKCksIHZpdGVQbHVnaW5NYW51c1J1bnRpbWUoKV07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnMsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImNsaWVudFwiLCBcInNyY1wiKSxcclxuICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcInNoYXJlZFwiKSxcclxuICAgICAgXCJAYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lLCBcImF0dGFjaGVkX2Fzc2V0c1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBlbnZEaXI6IHBhdGgucmVzb2x2ZShpbXBvcnQubWV0YS5kaXJuYW1lKSxcclxuICByb290OiBwYXRoLnJlc29sdmUoaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCJjbGllbnRcIiksXHJcbiAgcHVibGljRGlyOiBwYXRoLnJlc29sdmUoaW1wb3J0Lm1ldGEuZGlybmFtZSwgXCJjbGllbnRcIiwgXCJwdWJsaWNcIiksXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogcGF0aC5yZXNvbHZlKGltcG9ydC5tZXRhLmRpcm5hbWUsIFwiZGlzdC9wdWJsaWNcIiksXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGFsbG93ZWRIb3N0czogW1xyXG4gICAgICBcIi5tYW51c3ByZS5jb21wdXRlclwiLFxyXG4gICAgICBcIi5tYW51cy5jb21wdXRlclwiLFxyXG4gICAgICBcIi5tYW51cy1hc2lhLmNvbXB1dGVyXCIsXHJcbiAgICAgIFwiLm1hbnVzY29tcHV0ZXIuYWlcIixcclxuICAgICAgXCIubWFudXN2bS5jb21wdXRlclwiLFxyXG4gICAgICBcImxvY2FsaG9zdFwiLFxyXG4gICAgICBcIjEyNy4wLjAuMVwiLFxyXG4gICAgXSxcclxuICAgIGZzOiB7XHJcbiAgICAgIHN0cmljdDogdHJ1ZSxcclxuICAgICAgZGVueTogW1wiKiovLipcIl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlhLFNBQVMsb0JBQW9CO0FBQzliLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sV0FBVztBQUVsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyw4QkFBOEI7QUFOdkMsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSxVQUFVLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxhQUFhLEdBQUcsdUJBQXVCLENBQUM7QUFFakYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFxQixVQUFVLEtBQUs7QUFBQSxNQUN0RCxXQUFXLEtBQUssUUFBUSxrQ0FBcUIsUUFBUTtBQUFBLE1BQ3JELFdBQVcsS0FBSyxRQUFRLGtDQUFxQixpQkFBaUI7QUFBQSxJQUNoRTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsS0FBSyxRQUFRLGdDQUFtQjtBQUFBLEVBQ3hDLE1BQU0sS0FBSyxRQUFRLGtDQUFxQixRQUFRO0FBQUEsRUFDaEQsV0FBVyxLQUFLLFFBQVEsa0NBQXFCLFVBQVUsUUFBUTtBQUFBLEVBQy9ELE9BQU87QUFBQSxJQUNMLFFBQVEsS0FBSyxRQUFRLGtDQUFxQixhQUFhO0FBQUEsSUFDdkQsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLE1BQ1IsTUFBTSxDQUFDLE9BQU87QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
