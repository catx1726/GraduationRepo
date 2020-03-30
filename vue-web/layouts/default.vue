<template>
  <v-app>
    <Drawer :drawer="drawer" @changeDrawer="changeDrawer" />

    <Nav :drawer="drawer" @changeDrawer="changeDrawer" />

    <Nuxt />

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
