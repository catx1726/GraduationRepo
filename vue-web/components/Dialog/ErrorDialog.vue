<template>
  <div>
    <v-alert
      v-model="errDialog.showDialog"
      border="left"
      color="#26C6DA"
      transition="scroll-x-transition"
      dark
    >
      {{ errDialog.curErrMessage || '稍等....' }}
      <v-btn icon x-small @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-alert>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: '',

  components: {},
  props: {},
  data() {
    return {
      alert: false
    }
  },

  computed: {
    errDialog() {
      const error = this.$store.state.error
      // console.log('errDialog components:', error)
      return error
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    // DES 监听弹窗的关闭，然后修改 store，没有解决根本问题
    closeDialog() {
      // console.log('close errDialog toggle')
      this.$store.dispatch('error/changeShow', { status: false, message: '' })
    }
  }
}
</script>
<style lang="" scoped></style>
