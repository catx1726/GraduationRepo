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

// export function uploadAvatar(id, file) {
//   return request({
//     url: `${id}/upload`,
//     method: 'post',
//     file
//   })
// }

export function editUser(id, data) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

export function addUser(data) {
  return request({
    url: `users`,
    method: 'post',
    data
  })
}

