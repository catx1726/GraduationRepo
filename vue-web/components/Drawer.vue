<template>
  <div>
    <v-navigation-drawer
      v-model="computedDrawer"
      absolute
      temporary
      :right="true"
      width="80px"
      dark
      @input="tempInput"
    >
      <v-list-item>
        <v-list-item-avatar style="margin-left:5px;">
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg" />
        </v-list-item-avatar>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense class="d-flex flex-column" align="center" justify="center">
        <v-list-item v-for="item in navList" :key="item.title" link :to="item.link">
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="this.$store.state.user.name ? '/person' : ''" @click="showLoginDG">
          <v-list-item-content>
            <v-list-item-title>{{ this.$store.state.user.name || '登录' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: '',

  components: {},
  props: {
    loginDialog: {
      type: Boolean
    },
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempDrawer: this.drawer // 解决不能再 子组件中修改 props 的 warning
    }
  },

  computed: {
    ...mapGetters({
      navList: 'header/getAllNavList'
    }),
    computedDrawer: {
      get() {
        return this.drawer
      },
      set() {}
    }
  },

  watch: {
    // drawer() {
    //   console.log('Drawer 组件中 watch drawer 变化:', this.drawer)
    //   this.tempDrawer = this.drawer
    // }
  },

  beforeMount() {},

  mounted() {
    console.log('Drawer Component Data:', this.tempDrawer)
  },

  created() {},

  methods: {
    showLoginDG() {
      const name = this.$store.state.user.name
      // 未登录
      if (!name) {
        console.log('nav change loginDialog')
        // 修改父组件中的 loginDialog 打开登录界面
        this.$emit('update:loginDialog', !this.loginDialog)
      }
      // 已登录 click 不在生效
      return true
    },
    // OK 此方法是代替 input 事件，在单击空白区域时，需要同步 drawer 值到 兄弟组件中，解决需要双击同步状态的问题
    // TODO 也可用其他方法解决：Vuex
    tempInput(event) {
      this.$emit('changeDrawer', event)
    }
  }
}
</script>
<style lang="" scoped></style>
