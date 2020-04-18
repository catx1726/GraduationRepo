<template>
  <div class="activity-container">
    <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
        style="height:400px;"
      >
        <template v-slot:opposite>
          <p
            class="headline font-weight-bold"
            :style="'color:' + item.color"
            v-text="item.time"
          ></p>
        </template>
        <v-card :color="item.color" dark>
          <v-card-title class="title" style="height:100px">
            {{ item.title || item.name }}
          </v-card-title>
          <v-card-text class="white text--primary">
            <!-- TODO 内容不会有这么多，所以默认给定一个高度为 400px -->
            <p style="width:200px;text-overflow:ellipsis;overflow: hidden;">
              {{ item.content }}
            </p>
            <v-btn
              :color="item.color"
              class="mx-0"
              outlined
              :to="{ name: 'activity-id', params: { id: i, _id: item._id } }"
            >
              more
            </v-btn>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  data: () => ({
    iconColor: [
      { color: '#FF5959', icon: 'mdi-star' },
      { color: '#004A97', icon: 'mdi-book-variant' },
      { color: '#00ADBB', icon: 'mdi-airballoon' }
    ],
    // TODO 这里的 items 为了满足最低高度的要求(1200px 背景图铺满)，设置几个默认值，到时候和动态数据进行合并
    items: [
      {
        color: '#004A97',
        icon: 'mdi-book-variant',
        time: '2020年2月3日',
        title: '盛夏六月',
        content: '不负二月好时光',
        url: '/photo'
      },
      {
        color: '#FF5959',
        icon: 'mdi-star',
        time: '2020年2月1日',
        title: '健康冬泳',
        content: '痛苦才是人生的本质',
        url: '/about'
      },
      {
        color: '#00ADBB',
        icon: 'mdi-airballoon',
        time: '2020年1月1日',
        title: '开业活动',
        content: '为庆祝开业，特举行此活动',
        url: '/'
      }
    ]
  }),
  created() {
    this.getActivityList()
  },

  methods: {
    async getActivityList() {
      try {
        const res = await this.$axios.$get('/activities')
        res.list.forEach((i) => {
          const { color, icon } = this.iconColor[Math.floor(Math.random() * 3)]
          i.color = color
          i.icon = icon
        })
        this.items.unshift(...res.list)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-container {
  padding: 50px;
  // DES 此高度决定背景的填充程度，故应该让其默认大于 > 1200 然后后续自动扩展(不能写死1200)
  display: flex;
  justify-content: center;
  align-content: center;
  // height: 1200px;
  // @media screen and (max-width: 600px) {
  //   height: 1800px;
  // }
}
</style>
