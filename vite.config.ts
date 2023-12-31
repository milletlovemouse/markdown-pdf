import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteSvgLoader from 'vite-svg-loader';
import veauryVitePlugins from 'veaury/vite/index.js'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue(),
    ViteSvgLoader(),
    veauryVitePlugins({
      type: 'vue'
    })
  ],
  resolve: {
    alias: {
      '/@/': path.resolve(__dirname, '.', 'src') + '/',
      '@/': path.resolve(__dirname, '.', 'src') + '/',
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        target: 'https://124.71.32.191',
        rewrite: path => {
          console.log(path);
          return path.replace(/^\/api/, '')
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 将自定义的 HTML 模板关联到输出
        manualChunks: {
          index: ['./index.html'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "/@/styles/variables.scss";` // 你的全局样式文件路径
      }
    }
  }
});
