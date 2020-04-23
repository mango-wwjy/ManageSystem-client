import http from '@/utils/http'

export function getMessage(data) {
  return http.get('/api/message')
}

export function getCollegeDict(data) {
  return http.get('/api/common/collegeDict')
}

export function getClassInfoDict(data) {
  return http.get('/api/common/classInfoDict')
}

export function getTeacherInfoDict(data) {
  return http.get('/api/common/teacherInfoDict')
}

export function getChartInfo(data) {
  return http.get('/api/common/getChartInfo')
}
