import {login, logout, getUserInfo} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userName: '',
    avatar: '',
    realName:'',
    userEmail:'',
    userPhone:'',
    authId:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_REAL_NAME: (state, realName) => {
    state.realName = realName
  },
  SET_USER_EMAIL: (state,userEmail) => {
    state.userEmail = userEmail
  },
  SET_USER_PHONE: (state,userPhone) => {
    state.userPhone = userPhone
  },
  SET_AUTH_ID: (state,authId) => {
    state.authId = authId
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), userPassword: password }).then(response => {
        debugger
        const { data } = response.data
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { userName, avatar, realName, userEmail, userPhone, authId } = data
        commit('SET_REAL_NAME', realName)
        commit('SET_USER_EMAIL', userEmail)
        commit('SET_USER_PHONE', userPhone)
        commit('SET_AUTH_ID', authId)
        commit('SET_USER_NAME', userName)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

