import request from '@/utils/request'
import request2 from '@/utils/request2'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function login2(data) {
  return request2({
    url: '/dashboard/admin/sign-in',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList(query) {
  return request2({
    url: '/dashboard/users/retrieve',
    method: 'get',
    params:query
  })
}

export function boundUser(data) {
  return request2({
    url: '/dashboard/vdk/bound',
    method: 'post',
    data
  })
}