import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Add React plugin if you're using React
  server: {
    port: 5173, // Default port for Vite
  },
});