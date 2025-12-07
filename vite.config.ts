import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  base: '/Time_Tracking_App/', // ✅ REQUIRED FOR GITHUB PAGES

  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...mochaPlugins(process.env as any),
    react(),
    cloudflare()
  ],

  server: {
    allowedHosts: true,
  },

  build: {
    chunkSizeWarningLimit: 5000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
