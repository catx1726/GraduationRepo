import request from '@/utils/request'

export function activityList_Api(query) {
  return request({
    url: 'activity',
    method: 'get',
    params: query
  })
}

export function activityUpdata_Api(id, data) {
  return request({
    url: `activity/${id}`,
    method: 'put',
    data
  })
}

export function activityDelete_Api(id) {
  return request({
    url: `activity/${id}`,
    method: 'delete'
  })
}

export function activityAdd_Api(data) {
  return request({
    url: `activity`,
    method: 'post',
    data
  })
}
