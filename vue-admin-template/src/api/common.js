import request from '@/utils/request'

export function uploadFile_API(file) {
  return request({
    url: `upload`,
    method: 'post',
    data: file
  })
}
