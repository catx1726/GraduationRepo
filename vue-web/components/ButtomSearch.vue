<template>
  <div class="search-container">
    <!-- <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="message"
          filled
          clear-icon="mdi-close-circle"
          clearable
          label="Message"
          type="text"
        ></v-text-field>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  }
}
</script>

<style lang="scss" scopde>
.search-container {
  width: 1200px;
  height: 300px;
  background-image: url('/imgs/search-bg.jpg');
  background-size: contain;
  display: flex;
}
</style>
