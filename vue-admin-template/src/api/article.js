import request from '@/utils/request'

export function articleList_Api(query) {
  return request({
    url: 'article',
    method: 'get',
    params: query
  })
}

export function articleUpdata_Api(id, data) {
  return request({
    url: `article/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle_Api(id) {
  return request({
    url: `article/${id}`,
    method: 'delete'
  })
}

export function addArticle_Api(id, data) {
  return request({
    url: `article/${id}`,
    method: 'post',
    data
  })
}
