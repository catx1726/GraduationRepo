const state = {
  // 初始化state
  navList: [
    { link: '/', text: '首页' },
    { link: '/article', text: '文章' },
    { link: '/activity', text: '活动' },
    { link: '/coach', text: '教练' },
    { link: '/comment', text: '留言' },
    { link: '/photo', text: '图册' },
    { link: '/about', text: '关于' },
    { link: '/person', text: '我的' }
  ]
}

// 获取state
const getters = {
  getAllNavList(state) {
    return state.navList
  }
}

// 同步修改state
const mutations = {
  DELETE_NAVLIST: (state, text) => {
    // 通过text找到要删除的nav
    console.log('do do do Unicode 🤭')
  }
}

// 异步方式触发 mutation 修改 state
// const actions = {
//   delete({ commit }) {
//     try {
//       commit('DELETE_NAVLIST', 'TEST')
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

export default {
  namespaced: true,
  state,
  getters,
  // actions,
  mutations
}
