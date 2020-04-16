<template>
  <v-app>
    <Drawer :drawer="drawer" @changeDrawer="changeDrawer" />

    <Nav :drawer="drawer" :nav-scroll-target="navScrollTarget" @changeDrawer="changeDrawer" />

    <!-- TODO 将COLOR URL 利用 absolute margin-bottom 挂在了 header 上，以后每个 page 都得 margin-top:250px -->
    <Nuxt id="scrolling-techniques-4" class="main-bg color-mt-250" />

    <Footer />
  </v-app>
</template>

<script>
import Drawer from '~/components/Drawer'
import Nav from '~/components/Nav'
import Footer from '~/components/Footer'

export default {
  components: {
    Nav,
    Footer,
    Drawer
  },

  data() {
    return {
      // TODO 2020年4月4日 原 Nav 组件中的data
      tempDrawer: this.drawer,
      navList: this.$store.header.state.navList,
      // TODO end

      navScrollTarget: '#navScrollTarget',
      clipped: false,
      drawer: false
    }
  },
  methods: {
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
.color-mt-250 {
  margin-top: 250px;
}
</style>
