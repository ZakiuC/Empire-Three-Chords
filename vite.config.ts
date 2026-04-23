import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo name for GitHub Pages path
const repoBase = '/Empire-Three-Chords/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
}));
