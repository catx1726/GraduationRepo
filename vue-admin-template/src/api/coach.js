import request from '@/utils/request'

export function coachList_Api(query) {
  return request({
    url: 'coach',
    method: 'get',
    params: query
  })
}

export function coachUpdata_Api(id, data) {
  return request({
    url: `coach/${id}`,
    method: 'put',
    data
  })
}

export function coachDelete_Api(id) {
  return request({
    url: `coach/${id}`,
    method: 'delete'
  })
}

export function coachAdd_Api(data) {
  return request({
    url: `coach`,
    method: 'post',
    data
  })
}
