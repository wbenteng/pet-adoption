//统一管理项目流浪宠物管理相关的接口
import request from '@/utils/request'
//流浪宠物管理相关的请求地址
enum API {
  SEARCH_URL = '/animal/page',
  ADD_URL = '/animal',
  DELETE_URL = '/animal/',
  DELETEBatch_URL = '/animal/del/batch',
}
//暴露请求函数

//查询宠物接口
export const reqSearchPet = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改宠物接口
export const reqAddPet = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除宠物接口
export const reqDeletePet = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物接口
export const reqDeleteBatcbPet = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
