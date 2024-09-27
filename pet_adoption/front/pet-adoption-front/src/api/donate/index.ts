//统一管理项目捐赠管理相关的接口
import request from '@/utils/request'
//捐赠管理相关的请求地址
enum API {
  SEARCH_URL = '/donate/page',
  ADD_URL = '/donate',
  DELETE_URL = '/donate/',
  DELETEBatch_URL = '/donate/del/batch',
}
//暴露请求函数

//查询捐赠接口
export const reqSearchDonate = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改捐赠接口
export const reqAddDonate = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除捐赠接口
export const reqDeleteDonate = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除捐赠接口
export const reqDeleteBatcbDonate = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
