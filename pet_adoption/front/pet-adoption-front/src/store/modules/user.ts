//创建用户相关小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqLogout } from '@/api/user'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, Remove_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute } from '@/router/routes'
import router from '@/router'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

//过滤异步路由方法
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
//创建用户小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: () => {
    return {
      token: GET_TOKEN(), //用户唯一标识
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组
      username: '',
      avatar: '',
      buttons: [], //按钮权限
      user: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : {},
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: any) {
      //登录请求
      let result = await reqLogin(data)
      // console.log(result)
      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code == 200) {
        // //pinia仓库存储一下token
        // this.token = result.data
        // //本地存储一份
        // SET_TOKEN(result.data)
        localStorage.setItem('user', JSON.stringify(result.data)) // 存储用户信息到浏览器
        localStorage.setItem('menus', JSON.stringify(result.data.menus)) // 存储用户信息到浏览器
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    //获取用户信息的方法
    // async userInfo() {
    //   //获取用户信息进行存储仓库当中[用户头像、名字]
    //   let result = await reqUserInfo()
    //   //如果获取用户信息成功，存储一下用户信息
    //   if (result.code == 200) {
    //     // this.username = result.data.name
    //     // this.avatar = result.data.avatar
    //     // this.buttons = result.data.button
    //     //对比异步路由
    //     // let userAsyncRoute = filterAsyncRoute(
    //     //   cloneDeep(asnycRoute),
    //     //   result.data.routes,
    //     // )
    //     // //整合全部路由
    //     // this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]
    //     // //注册异步路由
    //     // ;[...userAsyncRoute, ...anyRoute].forEach((route: any) => {
    //     //   router.addRoute(route)
    //     // })
    //     // console.log(router.getRoutes())
    //     return 'ok'
    //   } else {
    //     return Promise.reject(result.message)
    //   }
    // },
    //退出登录
    // async userLogout() {
    //   let result: any = await reqLogout()
    //   if (result.code == 200) {
    //     this.token = ''
    //     this.username = ''
    //     this.avatar = ''
    //     Remove_TOKEN()
    //     return 'ok'
    //   } else {
    //     return Promise.reject(result.message)
    //   }
    // },
  },
  getters: {},
})

//对外暴露小仓库
export default useUserStore
