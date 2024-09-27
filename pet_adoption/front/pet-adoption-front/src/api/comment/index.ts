//统一管理项目评论管理相关的接口
import request from '@/utils/request'
//评论管理相关的请求地址
enum API {
  SEARCH_URL = '/comment/page',
  ADD_URL = '/comment',
  DELETE_URL = '/comment/',
  DELETEBatch_URL = '/comment/del/batch',
}
//暴露请求函数

//查询评论接口
export const reqSearchComment = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改评论接口
export const reqUpdateComment = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除评论接口
export const reqDeleteComment = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除评论接口
export const reqDeleteBatcbComment = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
