//统一管理项目用户相关的接口
import request from '@/utils/request'
//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/user/login',
  REGISTER_URL='/user/register',
  // USERINFO_URL = '/admin/acl/index/info',
  MEMBERS_URL='/echarts/members',
  LOGOUT_URL = '/admin/acl/index/logout',
}
//暴露请求函数
//登录接口方法
export const reqLogin = (data:any) =>
  request.post<any, any>(API.LOGIN_URL, data)
//注册接口方法
export const reqRegister = (data:any) =>
  request.post<any, any>(API.REGISTER_URL, data)
//获取用户信息接口方法
// export const reqUserInfo = () =>
//   request.get<any, any>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
