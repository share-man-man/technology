import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      // TODO 渲染器名称
      name: 'RenderReact',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react'],
    },
  },
  plugins: [dts(), react()],
});
