//统一管理项目申请领养管理相关的接口
import request from '@/utils/request'
//申请领养管理相关的请求地址
enum API {
  SEARCH_URL = '/applcation/page',
  AGREE_URL = '/applcation/state/',
  UPDATE_URL = '/applcation',
  DELETE_URL = '/applcation/',
  DELETEBatch_URL = '/applcation/del/batch',
}
//暴露请求函数

//查询申请领养接口
export const reqSearchPetAdoption = (data: any) =>
  request.get<any, any>(API.SEARCH_URL, data)
//审核通过宠物申请接口
export const reqAgreePetAdoption = (id: number, state: string) =>
  request.post<any, any>(API.AGREE_URL + id + '/' + state)
//修改宠物申请接口
export const reqUpdatePetAdoption = (data: any) =>
  request.post<any, any>(API.UPDATE_URL, data)
//删除宠物接口
export const reqDeletePetAdoption = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
//批量删除宠物接口
export const reqDeleteBatcbPetAdoption = (ids: number[]) =>
  request.post<any, any>(API.DELETEBatch_URL, ids)
