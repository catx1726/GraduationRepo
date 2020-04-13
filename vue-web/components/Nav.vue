<template>
  <!-- style="height:100vh;background-image:url(/imgs/blue-1839757_1920.jpg);background-size:cover;" -->
  <v-toolbar
    light
    prominent
    flat
    dense
    :src="height > 300 ? '/imgs/blue-1839757_1920.jpg' : '/imgs/water-1018808_1920.jpg'"
    :height="height"
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
    <v-row v-show="isIndex" no-gutters class="nav-intro">
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
    <v-row v-show="!isIndex" class="nav-name white--text display-2 font-weight-bold">
      <v-col>
        <p>{{ this.$route.name ? this.$route.name : '404' }}</p>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: '',

  components: {},
  filters: {},

  props: {
    navScrollTarget: {
      type: String,
      default: ''
    },
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: this.$store.header.getters.getHeaderHeight(this.$route.name),
      isIndex: '', // 在首页展示文章的控制变量，以及切换时在 header 下方展示当前路径的 名称
      tempNavScrollTarget: '#scrolling-techniques-4',
      tempDrawer: this.drawer,
      navList: this.$store.header.state.navList
    }
  },
  computed: {},

  watch: {
    $route() {
      this.height = this.$store.header.getters.getHeaderHeight(this.$route.name)
      // 在 route 变化时赋值
      if (this.$route.name === 'index') {
        this.isIndex = true
      } else {
        this.isIndex = false
      }
    },
    drawer() {
      console.log('子组件 Nav 发现父组件中的 drawer 改变了:', this.drawer)
      this.tempDrawer = this.drawer
    }
  },
  created() {},
  mounted() {
    // 加载DOM节点时给 isIndex 初始值
    if (this.$route.name === 'index') {
      this.isIndex = true
    } else {
      this.isIndex = false
    }

    console.log('cur route:', this.$route, 'nav store:', this.$store.header.state.navList)
    // this.$store.header.getters.getAllNavList()
    // console.log('nav scrollTarget:', this.tempNavScrollTarget)
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

// 非 index 页，在导航下显示当前页的名称
.nav-name {
  width: 300px;
  color: white;
  left: 35%;
  bottom: 0;
  position: absolute;
  text-transform: uppercase;
  line-height: 100px;
  transform: translateX(-30%);
}

.nav-intro {
  height: 350px;
  width: 350px;
  top: 50%;
  left: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  font-family: 'Source Sans Pro';
  transition: all 0.3s ease;
  &:hover {
    background-color: #00adbb;
    @include card-hover-boxshadow;
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
