import http from '@/utils/http'

export function fetchData(query) {
  return http.get('/api/teacher/fetchData', { params: query })
}

export function createData(data) {
  return http.post('/api/teacher/addData',data)
}

export function updateData(data) {
  return http.put('/api/teacher/updateData', data)
}

export function deleteData(id) {
  return http.delete('/api/teacher/deleteData/' + id)
}
