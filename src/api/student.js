import http from '@/utils/http'

export function getMessage(data) {
  return http.get('/api/message')
}

export function fetchStudent(query) {
  return http.get('/api/student/fetchStudentInfoData', { params: query })
}


export function createStudentInfo(data) {
  return http.post('/api/student/addStudentInfo',data)
}

export function updateStudent(data) {
  return http.put('/api/student/updateStudent', data)
}

export function deleteStudent(id) {
  return http.delete('/api/student/deleteStudent/' + id)
}

export function fetchSubject(query) {
  return http.get('/api/student/fetchSubject', { params: query })
}

export function chooseSubject(id) {
  return http.put('/api/student/chooseSubject/'+id)
}
