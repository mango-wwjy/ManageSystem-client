import http from '@/utils/http'

export function fetchData(query) {
  return http.get('/api/class/fetchData', { params: query })
}

export function createData(data) {
  return http.post('/api/class/addData',data)
}

export function updateData(data) {
  return http.put('/api/class/updateData', data)
}

export function deleteData(id) {
  return http.delete('/api/class/deleteData/' + id)
}
