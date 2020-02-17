import request from '@/utils/request'

export function commentList_Api(query) {
  return request({
    url: 'comments',
    method: 'get',
    params: query
  })
}

export function commentUpdate_Api(id, data) {
  return request({
    url: `comments/${id}`,
    method: 'put',
    data
  })
}

export function deleteComment_Api(id) {
  return request({
    url: `comments/${id}`,
    method: 'delete'
  })
}

export function addComment_Api(id, data) {
  return request({
    url: `comments/${id}`,
    method: 'post',
    data
  })
}
