<template>
  <v-footer style="background-color:white;" class="d-flex flex-column align-stretch">
    <v-row class="d-flex flex-nowrap justify-start">
      <div class="search-container d-flex align-center">
        <v-col cols="6" sm="3" offset="1">
          <v-text-field
            v-model="message"
            label="Search "
            color="white"
            class="search-css"
            single-line
            append-outer-icon="search"
            filled
            @click:append-outer="search"
          ></v-text-field>
        </v-col>
      </div>
    </v-row>
    <v-row class="d-flex flex-wrap flex-row align-center justify-center offset-2 ">
      <v-col class="col-md-3 col-12 d-flex justify-md-center justify-start">
        <v-btn
          v-ripple="{ center: true, class: 'blue--text text--lighten-3 ' }"
          color="black"
          text
          icon
          href="https://codepen.io/catx1726"
        >
          <v-icon dark>mdi-codepen</v-icon>
        </v-btn>
        <v-btn
          v-ripple="{ center: true, class: 'blue--text text--lighten-3 ' }"
          color="black"
          text
          icon
          href="https://github.com/catx1726"
        >
          <v-icon dark>mdi-github</v-icon>
        </v-btn>

        <v-btn
          v-ripple="{ center: true, class: 'blue--text text--lighten-3 ' }"
          color="black"
          text
          icon
          href="https://github.com/catx1726/GraduationRepo"
        >
          <v-icon dark>
            mdi-file-code-outline
          </v-icon>
        </v-btn>
      </v-col>
      <v-col class="col-md-6 col-12">
        Copyright © 2020 Health natatorium
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: '',

  components: {},
  props: [],
  data() {
    return {
      message: ''
    }
  },

  computed: {},

  watch: {},

  methods: {
    search() {
      // DES 直接转入 BING搜索 打开新页面
      const url = 'https://cn.bing.com/search?q=' + this.message
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
footer {
  margin: 0;
  padding: 0;
  transition: all 0.3s ease;
  &:hover {
    @include card-hover-boxshadow;
  }
}
.search-container {
  width: 100vw;
  height: 500px;
  margin-bottom: 100px;
  @media screen and (max-width: 1900px) {
    height: 400px;
  }
  @media screen and (max-width: 960px) {
    height: 300px;
    margin-bottom: 0px;
  }
  @media screen and (max-width: 600px) {
    height: 200px;
    margin-bottom: 0px;
  }
  padding: 0;
  background-image: url('/imgs/search-bg.jpg');
  background-size: contain;
}
</style>
