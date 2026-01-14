import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lottie: ["@lottiefiles/dotlottie-web"],
          vendor: ["uuid"],
        },
      },
    },
  },
});
