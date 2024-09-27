//统一管理项目宠物丢失管理相关的接口
import request from '@/utils/request'
//宠物丢失管理相关的请求地址
enum API {
  SEARCH_URL = '/article/page',
  ADD_URL = '/article',
  DELETE_URL = '/article/',
  DELETEBatch_URL = '/article/del/batch',
  FILE_URL = '/file/upload',
}
//暴露请求函数

//查询宠物丢失接口
export const reqSearchArticle = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改宠物丢失接口
export const reqAddArticle = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除宠物丢失接口
export const reqDeleteArticle = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物丢失接口
export const reqDeleteBatcbArticle = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
export const reqArticleFileUpload = (data: any) =>
  request.post<any, any>(API.FILE_URL, data)
