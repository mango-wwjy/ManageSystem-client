import http from '@/utils/http'

export function getMessage(data) {
  return http.get('/api/message')
}
