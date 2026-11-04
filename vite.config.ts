import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE === '1'
      ? visualizer({ open: false, filename: 'dist/bundle-stats.html', gzipSize: true })
      : undefined,
  ].filter(Boolean),
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    // Netlify sets NETLIFY=true during builds: route photos through the Netlify Image CDN there.
    'import.meta.env.VITE_NETLIFY_IMAGES': JSON.stringify(
      process.env.VITE_NETLIFY_IMAGES ?? (process.env.NETLIFY === 'true' ? 'true' : 'false'),
    ),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
