<template>
  <!-- style="height:100vh;background-image:url(/imgs/blue-1839757_1920.jpg);background-size:cover;" -->
  <v-toolbar
    light
    prominent
    flat
    hide-on-scroll
    dense
    src="/imgs/blue-1839757_1920.jpg"
    height="1000"
  >
    <v-row no-gutters align="center" justify="space-between">
      <v-col
        class="d-flex align-center align-md-center justify-md-end justify-sm-left md-4 sm-3"
        style="padding-right:20px;"
      >
        <v-toolbar-title class="white--text display-1 font-weight-light">
          Health natatorium
        </v-toolbar-title>
      </v-col>
      <v-col
        class="d-none d-sm-none d-md-flex justify-center align-center md-10"
        style="height:100px;background-color:white"
      >
        <v-tabs align-with-title color="black">
          <v-tabs-slider color="red"></v-tabs-slider>
          <v-tab
            v-for="item in navList"
            :key="item.link"
            v-ripple="{ center: true, class: 'blue--text text--lighten-3 ' }"
            :to="item.link"
            link
          >
            {{ item.text }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col class="d-sm d-md-none d-flex justify-end">
        <v-btn text @click="drawerChange">
          <svg-icon
            icon-class="expansion"
            style="width:32px;height:32px;cursor:pointer;color:white;"
          />
        </v-btn>
      </v-col>
    </v-row>

    <!-- TODO 2020年3月31日 此处展示一篇文章的标题与副标题，以及一点内容，现在先把样式写出来 -->
    <v-row no-gutters class="nav-intro">
      <v-col>
        <p class="intro-title">Lorem</p>
        <p class="intro-content">
          Lorem ipsum dolor .
        </p>
        <p class="intro-content">
          consectetur adipisicing elit.
        </p>
        <v-btn text color="white" class="intro-link" style="padding-left:5px" to="/article">
          LEARN MORE
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
</style>
