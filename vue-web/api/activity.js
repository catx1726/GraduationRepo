import request from '@/plugins/axios.js'

export function getActivityListAPI() {
  console.log('request')
  return request({
    url: 'activity',
    method: 'get'
  })
}
