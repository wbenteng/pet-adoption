//统一管理项目角色管理相关的接口
import request from '@/utils/request'
//角色管理相关的请求地址
enum API {
  SEARCH_URL = '/role/page',
  MENU_URL = '/menu/ids',
  ADDUSER_URL = '/role',
  DELETE_URL = '/role/',
  DELETEBatch_URL = '/role/del/batch',
}
//暴露请求函数

//查询角色接口
export const reqSearchRole = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//获取菜单接口
export const reqGetMenu = () =>
  request.get<any, any>(API.MENU_URL)
//添加角色接口
export const reqAddRole = (data: any) =>
  request.post<any, any>(API.ADDUSER_URL, data)
//删除用户接口
export const reqDeleteRole = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除角色接口
export const reqDeleteBatcbRole = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
