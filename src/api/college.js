import http from '@/utils/http'

export function fetchData(query) {
  return http.get('/api/college/fetchData', { params: query })
}

export function createData(data) {
  return http.post('/api/college/addData',data)
}

export function updateData(data) {
  return http.put('/api/college/updateData', data)
}

export function deleteData(id) {
  return http.delete('/api/college/deleteData/' + id)
}
