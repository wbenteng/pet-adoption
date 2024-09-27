//路由鉴权
import router from './router'
import setting from './setting'
//@ts-ignore
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
import '@/styles/rewriteNprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
let userStore = useUserStore(pinia)

//全局前置守卫
// router.beforeEach(async (to, from, next) => {
//   nprogress.start()
//   //获取token,去判断用户登录、还是未登录
//   let token = userStore.token
//   //获取用户名
//   let username = userStore.username
//   //用户登录判断
//   if (token) {
//     //登录成功不能访问login
//     if (to.path == '/login') {
//       next({ path: '/' })
//     } else {
//       //登录成功其他组件放行
//       if (username) {
//         //有用户信息放行
//         next()
//       } else {
//         //没有用户信息，发请求获取
//         try {
//           //获取用户信息
//           await userStore.userInfo()
//           next({ ...to })
//         } catch (error) {
//           //token过期或本地存储token被修改了
//           //退出登录
//           await userStore.userLogout()
//           next({ path: '/login', query: { redirect: to.path } })
//         }
//       }
//     }
//   } else {
//     //未登录login放行
//     if (to.path == '/login') {
//       next()
//     } else {
//       //未登录访问其他组件跳到登录页
//       next({ path: '/login', query: { redirect: to.path } })
//     }
//   }
//   next()
// })
//全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
  document.title = `${setting.title}- ${to.meta.title}`
})
