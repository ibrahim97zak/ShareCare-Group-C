import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the build
  },
  server:{
   host: 'localhost',
   port: 3000,
   proxy: {
   "/api": {
     target: "http://localhost:5000",
   }
 },
},
});
