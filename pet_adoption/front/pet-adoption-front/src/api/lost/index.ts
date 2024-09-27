//统一管理项目宠物丢失管理相关的接口
import request from '@/utils/request'
//宠物丢失管理相关的请求地址
enum API {
  SEARCH_URL = '/lost/page',
  ADD_URL = '/lost',
  DELETE_URL = '/lost/',
  DELETEBatch_URL = '/lost/del/batch',
}
//暴露请求函数

//查询宠物丢失接口
export const reqSearchLost = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改宠物丢失接口
export const reqAddLost = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除宠物丢失接口
export const reqDeleteLost = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物丢失接口
export const reqDeleteBatcbLost = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
