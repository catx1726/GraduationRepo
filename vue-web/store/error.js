/* eslint-disable no-unused-vars */
/* DES 这里可作一个 error log 然后发送到服务器进行保存 */
export const state = () => ({
  logs: [],
  showDialog: false,
  curErrMessage: ''
})

export const mutations = {
  ADD_ERR_LOG: (state, log) => {
    state.log.push(log)
  },
  CHANGE_SHOW: (state, errObj) => {
    state.showDialog = errObj.status
    state.curErrMessage = errObj.message
    console.log(state)
  }
}

export const actions = {
  addErrLog({ commit }, log) {
    commit('ADD_ERR_LOG', log)
  },
  changeShow({ commit }, errObj) {
    commit('CHANGE_SHOW', errObj)
  }
}
