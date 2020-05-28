import request from '@/utils/request'

export function meetingList_Api(query) {
  return request({
    url: 'meeting',
    method: 'get',
    params: query
  })
}

export function meetingUpdata_Api(id, data) {
  return request({
    url: `meeting/${id}`,
    method: 'put',
    data
  })
}

export function deleteMeeting_Api(id) {
  return request({
    url: `meeting/${id}`,
    method: 'delete'
  })
}

export function addMeeting_Api(id, data) {
  return request({
    url: `meeting/${id}`,
    method: 'post',
    data
  })
}
