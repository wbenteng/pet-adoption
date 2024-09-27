//统一管理项目个人信息相关的接口
import request from '@/utils/request'
//个人信息相关的请求地址
enum API {
  SEARCH_URL = '/user/username/',
  UPDATE_URL = '/user',
}
//暴露请求函数

//查询个人信息接口
export const reqSearchPerson = (data: any) =>
  request.get<any, any>(API.SEARCH_URL + data)
//修改个人信息接口
export const reqUpdatePerson = (data: any) =>
  request.post<any, any>(API.UPDATE_URL, data)
