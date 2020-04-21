// import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth.ts'

export const state = () => ({
  token: getToken(),
  name: '',
  avatar: '',
  des: ''
})

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_DES: (state, des) => {
    state.des = des
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

export const actions = {
  login({ commit }, userInfo) {
    const { name, password } = userInfo
    return new Promise((resolve, reject) => {
      this.$axios
        .$post('/auth/login', { name, password })
        .then((e) => {
          console.log('user store login res:', e)
          commit('SET_TOKEN', e.token)
          setToken(e.token)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getUserInfo({ commit, state }) {
    const token = state.token
    // Adds header: `Authorization: Bearer 123` to all requests
    this.$axios.setToken(token, 'Bearer')
    return new Promise((resolve, reject) => {
      this.$axios
        .$post('/auth/userInfo')
        .then((e) => {
          commit('SET_NAME', e.name)
          // commit('SET_AVATAR',res.avatar)
          // commit('SET_DES',res.des)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  logout({ commit, state }) {
    // DES 严格意义上的退出还应该给后台发送请求，让其处理该用户的 token
    const res = removeToken()
    console.log(res)
  }
}

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
