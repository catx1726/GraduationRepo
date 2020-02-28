<template>
  <div class="chart">
    echart
  </div>
</template>

<script>
import { activityList_Api } from '@/api/activity'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/lines')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

export default {
  name: '',

  components: {},
  props: [],
  data() {
    return {
      chart: null,
      activityName: ['陈花花', '刘草草', '向墩墩'],
      personNumber: [10, 52, 100],
      triggerType: '', // line
      triggerTooltip: '',
      nameSeries: '',
      xAxisType: ''
      // option: {
      //   color: ['#3398DB'],
      //   tooltip: {
      //     trigger: 'item',
      //     axisPointer: {
      //       // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: [
      //         'Mon',
      //         'Tue',
      //         'Wed',
      //         'Thu',
      //         'Fri',
      //         'Sat',
      //         'Sun',
      //         'Mon',
      //         'Tue',
      //         'Wed',
      //         'Thu',
      //         'Fri',
      //         'Sat',
      //         'Sun'
      //       ],
      //       axisTick: {
      //         alignWithLabel: false
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value'
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '直接访问',
      //       type: 'bar',
      //       barWidth: '60%',
      //       data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330, 220]
      //     }
      //   ]
      // }
    }
  },

  computed: {},

  watch: {
    xAxisType() {
      this.setOptions()
    }
  },

  beforeMount() {},

  mounted() {
    this.initCharts()
  },

  created() {
    this.geDatatList()
  },

  methods: {
    async geDatatList() {
      const { list, status } = await activityList_Api()
      console.log(list, status)
      if (!status) {
        return false
      }
      this.personNumber = []
      this.activityName = []
      list.forEach((item) => {
        this.activityName.push(item.name)
        this.personNumber.push(item.users.length.toString())
      })
      this.xAxisType = 'category'
      this.triggerType = 'shadow'
      this.triggerTooltip = 'item'
      this.nameSeries = '活动人数'
      console.log('names:', this.activityName, 'nums:', this.personNumber)
    },
    async initCharts() {
      this.chart = await echarts.init(this.$el)
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption(
        {
          title: {
            text: '活动报名人数一览'
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: this.triggerTooltip,
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: this.triggerType // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.activityName,
              axisTick: {
                alignWithLabel: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.nameSeries,
              type: 'bar',
              barWidth: '50%',
              data: this.personNumber
            }
          ]
        },
        true
      )
    }
  }
}
</script>
<style lang="scss">
.chart {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 80vw;
  height: 80vh;
}
</style>
