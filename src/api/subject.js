import http from '@/utils/http'

export function fetchOwnData(query) {
  return http.get('/api/subject/fetchOwnData', { params: query })
}

export function addAndUpdateData(data) {
  return http.post('/api/subject/addAndUpdateData',data)
}

export function updateData(data) {
  return http.put('/api/subject/updateData', data)
}

export function deleteData(id) {
  return http.delete('/api/subject/deleteData/' + id)
}

export function fetchDataById(id) {
  return http.get('/api/subject/fetchDataById/' + id)
}

export function fetchTree() {
  return http.get('/api/subject/fetchTree')
}

export function fetchMineStudent(id) {
  return http.get('/api/subject/fetchMineStudent/' + id)
}

export function deleteMineStudent(id) {
  return http.delete('/api/subject/deleteMineStudent/' + id)
}

export function updateMineStudent(data) {
  return http.put('/api/subject/updateMineStudent', data)
}
