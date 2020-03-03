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

export function adminList(query) {
  return request({
    url: 'admin',
    method: 'get',
    params: query
  })
}

export function editAdmin(id, data) {
  return request({
    url: `admin/${id}`,
    method: 'put',
    data
  })
}

export function deleteAdmin(id) {
  return request({
    url: `admin/${id}`,
    method: 'delete'
  })
}

// 这个要写成对应后端的 auth/register
export function addAdmin(data) {
  return request({
    url: `auth/register`,
    method: 'post',
    data
  })
}
