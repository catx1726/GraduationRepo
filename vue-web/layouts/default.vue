<template>
  <v-app>
    <Drawer
      v-if="drawer"
      :drawer="drawer"
      :login-dialog.sync="dialog"
      @changeDrawer="changeDrawer"
    />

    <Nav :drawer="drawer" :login-dialog.sync="dialog" @changeDrawer="changeDrawer" />

    <ErrorDialog class="error-dialog" />

    <Login v-if="dialog" :login-dialog.sync="dialog" />

    <!-- DES 将COLOR URL 利用 absolute margin-bottom 挂在了 header 上，以后每个 page 都得 margin-top:250px -->
    <Nuxt
      id="scrolling-techniques-4"
      :class="`main-bg ${isIdx ? 'color-mt-250' : 'color-mt-100'} `"
    />

    <Footer />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Drawer from '~/components/Drawer'
import Nav from '~/components/Nav'
import ErrorDialog from '~/components/Dialog/ErrorDialog'
import Footer from '~/components/Footer'
import Login from '~/components/Dialog/Login'

export default {
  components: {
    Nav,
    Footer,
    Drawer,
    ErrorDialog,
    Login
  },

  data() {
    return {
      // TODO 2020年4月4日 原 Nav 组件中的data
      tempDrawer: this.drawer,
      // TODO 2020年4月16日 观测 route 改变 margin-top 完善 color-url 显示
      isIdx: true,
      // navList: this.$store.state.header.state.navList,
      // navList: {},
      // TODO end

      navScrollTarget: '#navScrollTarget',
      clipped: false,
      drawer: false,
      dialog: false
    }
  },
  watch: {
    dialog() {
      console.log('layout dialog changeed')
    },
    $route() {
      // this.height = this.$store.header.getters.getHeaderHeight(this.$route.name)
      // 在 route 变化时赋值
      if (this.$route.name === 'index') {
        this.isIdx = true
      } else {
        this.isIdx = false
      }
    }
  },
  beforeCreate() {
    // console.log('layout check store', this.$store)
  },

  created() {
    // this.navList = this.getAllNavList()
  },
  methods: {
    ...mapGetters({
      navList: 'header/getAllNavList'
    }),
    changeDrawer(data) {
      this.drawer = data
      console.log('子组件传来的drawer data:', data, 'this.drawer:', this.drawer)
    }
  }
}
</script>
<style lang="scss">
// 覆盖 tool-bar 的 padding
.v-toolbar__content {
  padding: 0;
}

.error-dialog {
  position: absolute;
  left: 50vw;
  top: 50vh;
  z-index: 999;
  transform: translate(-50%, -50%);
}

.nav-intro {
  height: 350px;
  width: 350px;
  top: 50%;
  left: 0;
  // transform: translate(-50%, -50%);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  font-family: 'Source Sans Pro';
  transition: all 0.3s ease;
  &:hover {
    background-color: #00adbb;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);
  }
  .intro-title,
  .intro-content {
    margin: 0;
    line-height: 1;
  }
  .intro-title {
    font-size: 60px;
  }
  .intro-content {
    font-size: 20px;
    padding-left: 5px;
  }
  .intro-link {
    height: 20px;
    font-size: 18px;
    margin-top: 20px;
    padding-left: 5px;
  }
  @media screen and (max-width: 1600px) {
    background-color: #00adbb;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
    color: white;
  }
}
.main-bg {
  background-image: url('/imgs/wave-bg.svg');
  background-repeat: repeat-y;
  background-size: contain;
}
.color-mt-100 {
  margin-top: 100px;
}
.color-mt-250 {
  margin-top: 250px;
}
</style>
