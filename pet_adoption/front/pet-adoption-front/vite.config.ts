import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
    },
  },
  // scss全局变量配置
  css: {
    // 配置预处理器选项
    preprocessorOptions: {
      scss: {
        // 启用 JavaScript
        javascriptEnabled: true,
        // 全局数据（变量、混入等）
        additionalData: '@import "./src/styles/variables.scss";',
      },
    },
  },
  //代理跨域
  server: {
    proxy: {
      '/api': {
        //获取数据的服务器地址设置
        target: 'http://localhost:9090',
        //需要代理跨域
        changeOrigin: true,
        //路径重写
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
