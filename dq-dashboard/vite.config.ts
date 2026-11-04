import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single-file build for a claude.ai Artifact: everything inlined by scripts/inline.mjs.
export default defineConfig({
  plugins: [react()],
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false },
});
