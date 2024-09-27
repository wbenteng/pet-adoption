//统一管理项目宠物救助管理相关的接口
import request from '@/utils/request'
//宠物救助管理相关的请求地址
enum API {
  SEARCH_URL = '/rescue/page',
  ADD_URL = '/rescue',
  DELETE_URL = '/rescue/',
  DELETEBatch_URL = '/rescue/del/batch',
}
//暴露请求函数

//查询宠物救助接口
export const reqSearchRescue = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改宠物救助接口
export const reqAddRescue = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除宠物救助接口
export const reqDeleteRescue = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物救助接口
export const reqDeleteBatcbRescue = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
