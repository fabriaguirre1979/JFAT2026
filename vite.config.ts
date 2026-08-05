import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // base relativo: funciona en fabriaguirre1979.github.io/JFAT2026/ y en el dominio custom is-a.dev
  base: './',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});