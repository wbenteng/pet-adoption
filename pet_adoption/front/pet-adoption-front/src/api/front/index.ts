//统一管理项目前台相关的接口
import request from '@/utils/request'
//前台相关的请求地址
enum API {
  SEARCHFRONTNOTICE_URL = '/notice/front',
  SEARCHADOPTABLEPET_URL = '/animal/page/user',
  PETAPPLICATION_URL = '/applcation',
  SERACHPETDETAILURL = '/animal/',
  ADDPETPRAISE = '/animal',
  SEARCHPETCOMMENT = '/comment/article/1/',
  DELETEPETCOMMENT = '/comment/',
  ADDPETCOMMENT = '/comment',
  SEARCHMYADOPT = '/applcation/my',
  SEARCHARTICLECOMMENT = '/comment/article/2/',
}
//暴露请求函数

//查询前台公告接口
export const reqSearchFrontNotice = () =>
  request.get<any, any>(API.SEARCHFRONTNOTICE_URL)
//查询可领养宠物接口
export const reqSearchAdoptablePet = (data: any) =>
  request.get<any, any>(API.SEARCHADOPTABLEPET_URL, data)
//申请领养宠物接口
export const reqPetApplication = (data: any) =>
  request.post<any, any>(API.PETAPPLICATION_URL, data)
//获取某个宠物详情接口
export const reqPetDetail = (id: any) =>
  request.get<any, any>(API.SERACHPETDETAILURL + id)
//宠物点赞接口
export const reqAddPetPraise = (data: any) =>
  request.post<any, any>(API.SERACHPETDETAILURL, data)
//获取评论接口
export const reqSearchPetComment = (id: any) =>
  request.get<any, any>(API.SEARCHPETCOMMENT + id)
//删除评论接口
export const reqDeletePetComment = (id: any) =>
  request.delete<any, any>(API.DELETEPETCOMMENT + id)
//添加评论接口
export const reqAddPetComment = (data: any) =>
  request.post<any, any>(API.ADDPETCOMMENT, data)
//获取我的领养接口
export const reqSearchMyAdopt = () => request.get<any, any>(API.SEARCHMYADOPT)
//添加评论接口
export const reqSearchArticleComment = (id: any) =>
  request.get<any, any>(API.SEARCHARTICLECOMMENT + id)
