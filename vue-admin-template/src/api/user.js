import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'auth/userinfo',
    method: 'post',
    token
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}

export function userList(query) {
  return request({
    url: 'users',
    method: 'get',
    params: query
  })
}

