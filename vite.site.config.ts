import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const path = (file: string) => fileURLToPath(new URL(file, import.meta.url));

// The public showcase page. It imports the skin from src/ exactly as a site would.
export default defineConfig({
  root: path('./site'),
  base: './',
  resolve: { alias: { '@': path('./src') } },
  server: { fs: { allow: [path('.')] } },
  build: { outDir: path('./dist-site'), emptyOutDir: true },
});
