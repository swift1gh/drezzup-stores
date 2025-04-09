import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and related libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // React Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'router-vendor';
          }
          
          // Firebase modules - use a single chunk for all Firebase
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }
          
          // Application code
          if (id.includes('/src/components/')) {
            return 'app-components';
          }
          if (id.includes('/src/pages/')) {
            return 'app-pages';
          }
          if (id.includes('/src/utils/')) {
            return 'app-utils';
          }
          if (id.includes('/src/hooks/')) {
            return 'app-hooks';
          }
          
          // Other node modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
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
