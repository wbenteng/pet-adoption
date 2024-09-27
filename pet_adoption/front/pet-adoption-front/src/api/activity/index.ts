//统一管理项目活动管理相关的接口
import request from '@/utils/request'
//活动管理相关的请求地址
enum API {
  SEARCH_URL = '/activity/page',
  ADD_URL = '/activity',
  DELETE_URL = '/activity/',
  DELETEBatch_URL = '/activity/del/batch',
  FILE_URL = '/file/upload',
}
//暴露请求函数

//查询活动接口
export const reqSearchActivity = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改活动接口
export const reqAddActivity = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除活动接口
export const reqDeleteActivity = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除活动接口
export const reqDeleteBatcbActivity = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
export const reqActivityFileUpload = (data: any) =>
  request.post<any, any>(API.FILE_URL, data)
