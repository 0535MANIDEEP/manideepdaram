import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset paths, so the same build works at a github.io project path
  // (https://user.github.io/repo/) and at a custom domain root, with no
  // rebuild when a domain is attached later.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split long-lived vendor code out of the app chunk so a content change
        // does not invalidate React and Motion in every visitor's cache.
        // Rolldown requires the function form, not the object form.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-dom') || /[\\/]react[\\/]/.test(id)) return 'react';
          if (id.includes('motion') || id.includes('framer')) return 'motion';
          if (id.includes('lenis')) return 'scroll';
          if (id.includes('sonner')) return 'toast';
          return 'vendor';
        },
      },
    },
  },
});
