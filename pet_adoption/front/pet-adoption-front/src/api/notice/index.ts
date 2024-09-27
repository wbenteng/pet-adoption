//统一管理项目公告管理相关的接口
import request from '@/utils/request'
//公告管理相关的请求地址
enum API {
  SEARCH_URL = '/notice/page',
  ADD_URL = '/notice',
  DELETE_URL = '/notice/',
  DELETEBatch_URL = '/notice/del/batch',
}
//暴露请求函数

//查询公告接口
export const reqSearchNotice = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改公告接口
export const reqAddNotice = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除公告接口
export const reqDeleteNotice = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除公告接口
export const reqDeleteBatcbNotice = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
