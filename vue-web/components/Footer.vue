<template>
  <v-foote class="bg-bg-primary-color">
    <v-row class="d-flex flex-wrap flex-row align-center justify-center offset-2">
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
  </v-foote>
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
<style lang="" scoped></style>
