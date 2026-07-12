import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },

  plugins: [react()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    // Target modern browsers — removes legacy polyfills
    target: "es2020",

    // Inline small assets ≤ 4 KB as base64 (saves HTTP requests for icons/svgs)
    assetsInlineLimit: 4096,

    // Raise warning threshold — we've split everything intentionally
    chunkSizeWarningLimit: 700,

    // Each component gets its own CSS chunk — better caching granularity
    cssCodeSplit: true,

    // Use esbuild for minification — fastest, produces near-terser output
    minify: "esbuild",
    esbuildOptions: {
      // Strip all console.* and debugger in production
      drop: mode === "production" ? ["console", "debugger"] : [],
      // Remove legal comments — reduces bundle size
      legalComments: "none",
    },

    // Source maps only in development — don't leak source in production
    sourcemap: mode !== "production",

    rollupOptions: {
      output: {
        // ── Granular manual chunk splitting ──────────────────────────────
        // Each chunk is independently cached. When you update your app code,
        // only the `index` chunk hash changes. Users keep vendor chunks cached.
        manualChunks(id) {
          // React core runtime — changes almost never
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")) {
            return "react-core";
          }
          // React Router — changes rarely
          if (id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run/")) {
            return "router";
          }
          // Framer Motion — large but stable
          if (id.includes("node_modules/framer-motion")) {
            return "framer";
          }
          // All Radix UI primitives — very stable
          if (id.includes("node_modules/@radix-ui/")) {
            return "ui-radix";
          }
          // TanStack Query
          if (id.includes("node_modules/@tanstack/")) {
            return "query";
          }
          // Lucide React icons
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          // Remaining node_modules (clsx, sonner, vaul, etc.)
          if (id.includes("node_modules/")) {
            return "utils";
          }
        },
        // Stable file naming for long-lived cache headers
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },

  // Pre-bundle critical deps for faster cold starts
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
      "framer-motion",
    ],
  },
}));
