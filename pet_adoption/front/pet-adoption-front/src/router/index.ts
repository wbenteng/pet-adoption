//通过vue-router插件实现模板路由配置
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { constantRoute, FConstantRoute } from './routes'
//创建路由器
let router = createRouter({
  //路由模式hash
  history: createWebHistory(),
  routes: [...constantRoute, ...FConstantRoute],
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
