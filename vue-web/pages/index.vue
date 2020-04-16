<template>
  <main>
    <Activity />

    <Transition />

    <Coach />
  </main>
</template>

<script>
import Activity from '~/components/Activity'
import Coach from '~/components/Coach'
import Transition from '~/components/Transition'

export default {
  components: {
    Activity,
    Coach,
    Transition
  }
}
</script>
<style lang="scss">
// main {
//   background-image: url('/imgs/wave-bg.svg');
//   background-repeat: repeat-y;
//   background-size: contain;
// }
</style>
