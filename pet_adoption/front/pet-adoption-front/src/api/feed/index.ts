//统一管理项目宠物喂养点管理相关的接口
import request from '@/utils/request'
//宠物喂养点管理相关的请求地址
enum API {
  SEARCH_URL = '/feed/page',
  ADD_URL = '/feed',
  DELETE_URL = '/feed/',
  DELETEBatch_URL = '/feed/del/batch',
}
//暴露请求函数

//查询宠物喂养点接口
export const reqSearchFeed = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改宠物喂养点接口
export const reqAddFeed = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除宠物喂养点接口
export const reqDeleteFeed = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物喂养点接口
export const reqDeleteBatcbFeed = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
