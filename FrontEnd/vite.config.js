import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the build
  },
  server: {
    host: true, // Allow access from external IPs
    port: process.env.PORT || 3000, // Use environment variable for port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Update this for production
        changeOrigin: true,
      }
    },
  },
});
