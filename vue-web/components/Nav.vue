<template>
  <v-toolbar light prominent flat hide-on-scroll>
    <v-container fluid>
      <v-row no-gutters style="height: 150px;" align="center" justify="center">
        <v-col lg="3">
          <v-toolbar-title>Health natatorium</v-toolbar-title>
        </v-col>
        <v-col>
          <v-tabs align-with-title>
            <v-tab>首页</v-tab>
            <v-tab>文章</v-tab>
            <v-tab>活动</v-tab>
            <v-tab>教练</v-tab>
            <v-tab>留言</v-tab>
            <v-tab>图册</v-tab>
            <v-tab>关于</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
export default {
  name: '',

  components: {},
  props: [],
  data() {
    return {}
  },

  computed: {},

  watch: {},

  methods: {}
}
</script>
<style lang="scss"></style>
