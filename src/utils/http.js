import ax from 'axios'
import router from '../router'
import {Message} from "element-ui";

const server = ax.create({
  withCredentials: true,
  isRetryRequest: false,
  timeout: 50000
})

// request interceptor
server.interceptors.request.use(
  config => {
    switch (config.method) {
      case 'get': {
        // get方法加一个时间参数,解决ie下可能缓存问题.
        if (!config.params) {
          config.params = {}
        } else {
          config.params = { ...config.params }
        }
        if (!config.params.t) {
          config.params.t = new Date().getTime()
        }
        break
      }
      case 'post': {
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }
        break
      }
      case 'put': {
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }
        break
      }
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
server.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 404) {
      router.push('/')
    }
    if(error.response && error.response.status === 400){
      Message({
        message: '获取token失败，请检查用户名和密码是否正确',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error.response)
  }
)

export default server
