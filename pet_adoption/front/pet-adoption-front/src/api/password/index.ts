//统一管理项目密码相关的接口
import request from '@/utils/request'
//密码相关的请求地址
enum API {
  UPDATE_URL = '/user/password',
}
//暴露请求函数

//修改密码接口
export const reqUpdatePassword = (data: any) =>
  request.post<any, any>(API.UPDATE_URL, data)
