//统一管理项目科普文章管理相关的接口
import request from '@/utils/request'
//科普文章管理相关的请求地址
enum API {
  SEARCH_URL = '/articleKp/page',
  ADD_URL = '/articleKp',
  DELETE_URL = '/articleKp/',
  DELETEBatch_URL = '/articleKp/del/batch',
  FILE_URL = '/file/upload',
}
//暴露请求函数

//查询科普文章接口
export const reqSearchArticlKp = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//添加修改科普文章接口
export const reqAddArticleKp = (data: any) =>
  request.post<any, any>(API.ADD_URL, data)
//删除科普文章接口
export const reqDeleteArticleKp = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除科普文章接口
export const reqDeleteBatcbArticleKp = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
export const reqArticleFileUpload = (data: any) =>
  request.post<any, any>(API.FILE_URL, data)
