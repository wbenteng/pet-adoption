//统一管理项目用户管理相关的接口
import request from '@/utils/request'
//用户管理相关的请求地址
enum API {
  SEARCH_URL = '/user/page',
  SEARCHROLE_URL = '/role',
  ADD_URL = '/user',
  DELETE_URL = '/user/',
  DELETEBatch_URL = '/user/del/batch',
}
//暴露请求函数

//查询用户接口
export const reqSearchUser = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//查询角色接口
export const reqSearchRoleName = () => request.get<any, any>(API.SEARCHROLE_URL)
//添加用户接口
export const reqAddUser = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除用户接口
export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除用户接口
export const reqDeleteBatcbUser = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
