import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, introduction) {
    commit('SET_INTRODUCTION', introduction)
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

