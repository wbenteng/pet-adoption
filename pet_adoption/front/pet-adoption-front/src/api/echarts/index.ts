//统一管理项目图表相关的接口
import request from '@/utils/request'
//项目图表相关的请求地址
enum API {
  MEMBERS_URL='/echarts/members'
}
//暴露请求函数
//登录接口方法

//请求人数接口
export const reqMembers = () => request.get<any, any>(API.MEMBERS_URL)
