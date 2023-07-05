import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function getStat() {
  return request({
    url: '/dashboard/stat', // 仪表盘数据统计
    method: 'get'
  })
}