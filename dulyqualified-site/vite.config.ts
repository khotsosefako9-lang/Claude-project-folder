import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run build:artifact` makes a single-file build (fonts inlined) for a claude.ai Artifact.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build:
    mode === 'artifact'
      ? { outDir: 'dist-artifact', assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false }
      : {},
}));
