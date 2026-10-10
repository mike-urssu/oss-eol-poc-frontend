import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vite build --mode lib` builds the component library (dist/) that design-sync converts;
// a plain `vite build` builds the app (dist-app/).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build:
    mode === 'lib'
      ? {
          lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index', cssFileName: 'style' },
          rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
        }
      : { outDir: 'dist-app' },
}));
