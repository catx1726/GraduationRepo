export const state = () => ({
  // 初始化state
  navList: [
    { link: '/', text: '首页' },
    { link: '/article', text: '文章' },
    { link: '/meeting', text: '记录' },
    { link: '/activity', text: '活动' },
    { link: '/coach', text: '教练' },
    { link: '/comment', text: '留言' },
    { link: '/photo', text: '图册' },
    { link: '/about', text: '关于' }
    // { link: '/person', text: '我的' }
  ],
  // height 除 index外，高度均为300
  headerHeight: { index: 1000, else: 200 }
})

// 获取state
export const getters = {
  getAllNavList: (state) => {
    console.log('getters nav list!')
    return state.navList
  },
  getHeaderHeight: (state) => (url) => {
    console.log(`getters ${url} nav height!`)
    if (url === 'index') {
      return state.headerHeight.index
    }
    return state.headerHeight.else
  }
}

// 同步修改state
export const mutations = {
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

// export default () => ({
//   namespaced: true,
//   state,
//   getters,
//   // actions,
//   mutations
// })
