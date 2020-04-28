import http from '@/utils/http'

export function fetchNoticeInfoData(query) {
  return http.get('/api/notice/fetchNoticeInfoData', { params: query })
}

export function insertNoticeInfo(data) {
  return http.post('/api/notice/insertNoticeInfo',data)
}


export function deleteNotice(id) {
  return http.delete('/api/notice/deleteNotice/' + id)
}

export function fetchNoticeById(id) {
  return http.get('/api/notice/fetchNoticeById/' + id)
}

