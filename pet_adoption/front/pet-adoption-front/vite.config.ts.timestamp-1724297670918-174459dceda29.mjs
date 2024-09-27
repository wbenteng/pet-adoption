// vite.config.ts
import { defineConfig } from "file:///C:/Users/LENOVO/Desktop/%E6%AF%95%E8%AE%BE/pet_adoption/front/pet-adoption-front/node_modules/.pnpm/vite@5.4.1_@types+node@22.4.1_sass@1.77.8/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/LENOVO/Desktop/%E6%AF%95%E8%AE%BE/pet_adoption/front/pet-adoption-front/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.1_@types+node@22.4.1_sass@1.77.8__vue@3.4.38_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///C:/Users/LENOVO/Desktop/%E6%AF%95%E8%AE%BE/pet_adoption/front/pet-adoption-front/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.1_@types+node@22.4.1_sass@1.77.8_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import VueSetupExtend from "file:///C:/Users/LENOVO/Desktop/%E6%AF%95%E8%AE%BE/pet_adoption/front/pet-adoption-front/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.4.1_@types+node@22.4.1_sass@1.77.8_/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src")
      // 相对路径别名配置，使用 @ 代替 src
    }
  },
  // scss全局变量配置
  css: {
    // 配置预处理器选项
    preprocessorOptions: {
      scss: {
        // 启用 JavaScript
        javascriptEnabled: true,
        // 全局数据（变量、混入等）
        additionalData: '@import "./src/styles/variables.scss";'
      }
    }
  },
  //代理跨域
  server: {
    proxy: {
      "/api": {
        //获取数据的服务器地址设置
        target: "http://localhost:9090",
        //需要代理跨域
        changeOrigin: true,
        //路径重写
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMRU5PVk9cXFxcRGVza3RvcFxcXFxcdTZCRDVcdThCQkVcXFxccGV0X2Fkb3B0aW9uXFxcXGZyb250XFxcXHBldC1hZG9wdGlvbi1mcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTEVOT1ZPXFxcXERlc2t0b3BcXFxcXHU2QkQ1XHU4QkJFXFxcXHBldF9hZG9wdGlvblxcXFxmcm9udFxcXFxwZXQtYWRvcHRpb24tZnJvbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0xFTk9WTy9EZXNrdG9wLyVFNiVBRiU5NSVFOCVBRSVCRS9wZXRfYWRvcHRpb24vZnJvbnQvcGV0LWFkb3B0aW9uLWZyb250L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgVnVlU2V0dXBFeHRlbmQoKSxcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucycpXSxcbiAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKCcuL3NyYycpLCAvLyBcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1MjggQCBcdTRFRTNcdTY2RkYgc3JjXG4gICAgfSxcbiAgfSxcbiAgLy8gc2Nzc1x1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1OTE0RFx1N0Y2RVxuICBjc3M6IHtcbiAgICAvLyBcdTkxNERcdTdGNkVcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcdTkwMDlcdTk4NzlcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIC8vIFx1NTQyRlx1NzUyOCBKYXZhU2NyaXB0XG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICAvLyBcdTUxNjhcdTVDNDBcdTY1NzBcdTYzNkVcdUZGMDhcdTUzRDhcdTkxQ0ZcdTMwMDFcdTZERjdcdTUxNjVcdTdCNDlcdUZGMDlcbiAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCI7JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy9cdTRFRTNcdTc0MDZcdThERThcdTU3REZcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICAvL1x1ODNCN1x1NTNENlx1NjU3MFx1NjM2RVx1NzY4NFx1NjcwRFx1NTJBMVx1NTY2OFx1NTczMFx1NTc0MFx1OEJCRVx1N0Y2RVxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjkwOTAnLFxuICAgICAgICAvL1x1OTcwMFx1ODk4MVx1NEVFM1x1NzQwNlx1OERFOFx1NTdERlxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vXHU4REVGXHU1Rjg0XHU5MUNEXHU1MTk5XG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrWixTQUFTLG9CQUFvQjtBQUMvYSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sb0JBQW9CO0FBRzNCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLGVBQWU7QUFBQSxJQUNmLHFCQUFxQjtBQUFBLE1BQ25CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQSxNQUMxRCxVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsT0FBTztBQUFBO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLEtBQUs7QUFBQTtBQUFBLElBRUgscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBO0FBQUEsUUFFSixtQkFBbUI7QUFBQTtBQUFBLFFBRW5CLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBO0FBQUEsUUFFTixRQUFRO0FBQUE7QUFBQSxRQUVSLGNBQWM7QUFBQTtBQUFBLFFBRWQsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
