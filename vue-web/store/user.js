// import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth.ts'

export const state = () => ({
  token: getToken(),
  name: '',
  avatar: '',
  des: ''
})

export const mutations = {
  SET_TOKEN: (token) => {
    state.token = token
  },
  SET_DES: (des) => {
    state.des = des
  },
  SET_AVATAR: (avatar) => {
    state.avatar = avatar
  },
  SET_NAME: (name) => {
    state.name = name
  }
}

export const actions = {
  async login({ commit }, userInfo) {
    const { name, password } = userInfo
    const res = await this.$axios.$post('/auth/login', { name, password })
    console.log(res)
    if (res.status !== 200) {
      throw new Error(res.error.response.message)
    }
    console.log('user store login res:', res)
    commit('SET_TOKEN', res.token)
    setToken(res.token)
  },
  async getUserInfo({ commit, state }) {
    const token = state.token
    // Adds header: `Authorization: Bearer 123` to all requests
    this.$axios.setToken(token, 'Bearer')
    const res = await this.$axios.$post('/auth/userInfo')
    if (res.colde !== 200) {
      throw new Error(res.message)
    }
    commit('SET_NAME', res.name)
    // commit('SET_AVATAR',res.avatar)
    // commit('SET_DES',res.des)
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
