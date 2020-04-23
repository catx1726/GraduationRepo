<template>
  <div class="about-container">
    <div v-for="(i, index) in article" :key="index" class="ar-section">
      <div class="ar-title">{{ i.title }}</div>
      <div class="ar-content">
        <div>
          {{
            index === 0
              ? 'The National Governing Body(NGB) for swimming, water polo, diving and synchronised swimming across the 32 counties of the island of Ireland, recognised as such by the Department of Transport, Tourism and Sport through Sport Ireland and Sport NorthernIreland. We are recognised at world level by FINA, and at European level by LEN'
              : ' Getting fit. Getting faster.'
          }}
        </div>
        <div>
          {{
            index === 0
              ? 'We exist to encourage participation, develop excellence and regulate our sport and have set out our goals in our 5-year strategic plan.'
              : 'Fifty lengths without stopping. '
          }}
        </div>
        <div>
          {{
            index === 0
              ? ' Our legal structure is that of a company limited by guarantee. We adopted the Voluntary Code of Governance in 2013 and were the first sporting NGB to be compliant with the Code.'
              : 'Touching the bottom. One length without stopping.'
          }}
        </div>
        <div>
          {{
            index === 0
              ? 'Strategic direction is provided by our 11 strong Board of Directors, elected annually at our AGM. The Board are supported by the Swim Ireland President who is elected annually in a voluntary position. The operational responsibility rests with the Chief Executive Officer and staff.'
              : 'Toe in the water. Face in the water. Staying afloat.'
          }}
        </div>
      </div>
    </div>

    <Transition />
  </div>
</template>

<script>
import Transition from '@/components/Transition'
export default {
  name: '',

  components: { Transition },
  props: {},
  data() {
    return {
      article: [
        { title: 'Who are we?' },
        { title: 'Our Manifesto - Everyone has a connection with the water' }
      ]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {}
}
</script>
<style lang="scss" scoped>
.about-container {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  min-height: 1200px;
  padding-top: 100px;
  .ar-section {
    width: 40vw;
    @media screen and(max-width: 1264px) {
      width: 60vw;
    }
    @media screen and(max-width: 960px) {
      width: 90vw;
    }
    .ar-title {
      font-size: 30px;
      font-weight: bolder;
    }
    .ar-content {
      div {
        margin-top: 15px;
      }
      font-size: 18px;
      line-height: 180%;
      font-weight: 400;
      padding-bottom: 50px;
    }
  }
}
</style>
