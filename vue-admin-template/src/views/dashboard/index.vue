<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <Chart />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from './component/Chart'

export default {
  name: 'Dashboard',
  components: { Chart },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
