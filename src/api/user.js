import http from '@/utils/http'

export function login(data) {
  return http.put('/api/user/login', data)
}

export function register(data) {
  return http.put('/api/user', data)
}

export function updateUser(data) {
  return http.put('/api/user', data)
}

export function addUser(data) {
  return http.post('/api/user', data)
}

export function deleteUser(id) {
  return http.delete('/api/user/' + id)
}

export function updateUserPass(data) {
  return http.put('/api/user', data)
}

export function fetchUser(query) {
  return http.get('/api/user', { params: query })
}

export function fetchUserById(id) {
  return http.get('/api/user/' + id)
}

export function getUserInfo(token) {
  return http.get('/api/user/token', {
    params: {
      'token': token
    }
  })
}

