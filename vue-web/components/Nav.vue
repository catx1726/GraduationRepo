<template>
  <v-toolbar light prominent flat hide-on-scroll dense height="300px">
    <v-row no-gutters align="center" justify="space-between">
      <v-col class="d-flex align-center align-md-center justify-md-end justify-sm-left md-6 sm-3">
        <v-toolbar-title>Health natatorium</v-toolbar-title>
      </v-col>
      <v-col class="d-none d-sm-none d-md-flex">
        <v-tabs align-with-title>
          <v-tab v-for="item in navList" :key="item.link" :to="item.link" link>
            {{ item.text }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="d-sm d-md-none d-flex justify-end">
        <v-btn text @click="drawerChange">
          <svg-icon icon-class="expansion" style="width:32px;height:32px;cursor:pointer;" />
        </v-btn>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: '',

  components: {},

  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tempDrawer: this.drawer,
      navList: this.$store.header.state.navList
    }
  },
  computed: {},

  watch: {
    drawer() {
      console.log('子组件 Nav 发现父组件中的 drawer 改变了:', this.drawer)
      this.tempDrawer = this.drawer
    }
  },
  mounted() {
    // console.log('store:', mapGetters('header'))
    console.log('store:', this.$store.header.state.navList)
  },

  methods: {
    drawerChange() {
      console.log('son drawer change method!')
      this.tempDrawer = !this.tempDrawer
      this.$emit('changeDrawer', this.tempDrawer)
    }
  }
}
</script>
<style lang="scss"></style>
