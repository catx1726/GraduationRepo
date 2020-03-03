import { login, logout, getInfo } from '@/api/admin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: ''
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { name, password } = userInfo
    console.log(name, password)
    return new Promise((resolve, reject) => {
      login({ name: name.trim(), password: password })
        .then((response) => {
          const data = response
          commit('SET_TOKEN', data.token)
          console.log('auth端保存token后返回的东西:' + setToken(data.token))
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const data = response

          console.log('userInfo:', response)

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { name, avatar, _id } = data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar || 'occupation')
          commit('SET_ID', _id)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    console.log('logout:', commit, state)
    // DES 后台没写退出，可能不安全，token 不会改变
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
    // return new Promise((resolve, reject) => {
    //   logout(state.token)
    //     .then(() => {
    //       removeToken() // must remove  token  first
    //       resetRouter()
    //       commit('RESET_STATE')
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
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
