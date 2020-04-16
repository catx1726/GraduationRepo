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
            v-text="item.year"
          ></p>
        </template>
        <v-card :color="item.color" dark>
          <v-card-title class="title" style="height:100px">Lorem Ipsum Dolor</v-card-title>
          <v-card-text class="white text--primary">
            <!-- TODO 内容不会有这么多，所以默认给定一个高度为 400px -->
            <p style="height:200px;text-overflow:ellipsis;overflow: hidden;">
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut,
              sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril
              disputando voluptatibus, vix an salutandi sententiae. Lorem ipsum dolor sit amet, no
              nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire
              principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix
              an salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque
              percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae. Lorem
              ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed
              euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando
              voluptatibus, vix an salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique
              veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et
              nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi
              sententiae. Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an
              vim zril disputando voluptatibus, vix an salutandi sententiae. Lorem ipsum dolor sit
              amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire
              principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix
              an salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque
              percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
            </p>
            <v-btn :color="item.color" class="mx-0" outlined>
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
    // TODO 这里的 items 为了满足最低高度的要求(1200px 背景图铺满)，设置几个默认值，到时候和动态数据进行合并
    items: [
      {
        color: '#FF5959',
        icon: 'mdi-star',
        year: '2020年4月16日'
      },
      {
        color: '#004A97',
        icon: 'mdi-book-variant',
        year: '2020年4月15日'
      },
      {
        color: '#00ADBB',
        icon: 'mdi-airballoon',
        year: '2020年4月14日'
      }
    ]
  })
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
