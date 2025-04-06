import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        "react-router-dom",
        "firebase",
        "firebase/app",
        "firebase/auth",
        "firebase/firestore",
        "firebase/storage",
        "firebase/analytics",
      ],
    },
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
