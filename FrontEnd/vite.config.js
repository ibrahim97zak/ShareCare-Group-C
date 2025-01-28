import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';

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
        target: isProduction ? "https://sharecare-group-c-dp4v.onrender.com" : "http://localhost:5000", // Conditional target based on environment
        changeOrigin: true,
      }
    },
  },
});
