<template>
  <div>
    <Nav />

    <Nuxt />

    <Footer />
  </div>
</template>

<script>
import Nav from '~/components/Nav'
import Footer from '~/components/Footer'

export default {
  components: {
    Nav,
    Footer
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
