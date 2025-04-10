import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // Don't use external for these packages
      external: [],
      output: {
        // Disable code splitting entirely
        manualChunks: undefined
      }
    }
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'firebase/app', 
      'firebase/auth', 
      'firebase/firestore', 
      'firebase/storage'
    ]
  },
  base: '/', // Change this if your site is in a subdirectory
});
