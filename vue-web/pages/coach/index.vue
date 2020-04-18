<template>
  <div v-resize="onResize" class="coaches-container">
    <v-row class="rest-row-ml d-flex align-center" justify="center">
      <v-col class="d-flex flex-wrap box-shadow">
        <v-window v-model="window" class="elevation-1" :vertical="dir">
          <v-window-item v-for="n in persons" :key="n._id">
            <v-card>
              <v-row>
                <v-col class="d-flex justify-center align-center">
                  <v-img
                    contain
                    width="1200"
                    :src="`${n.avatar ? n.avatar : '/imgs/coach1-3.jpg'}`"
                    style="padding-left:10px;padding-right:10px"
                  ></v-img>
                </v-col>
                <v-col style="padding-left:20px">
                  <v-row class="rest-row-ml personinfor-container">
                    <div class="personinfor-title">
                      Name:
                    </div>
                    <div class="personinfor-content personinfor-content-name">
                      {{ n.name ? n.name : '基努·里维斯(Keanu Reeves)' }}
                    </div>
                  </v-row>
                  <v-row class="rest-row-ml personinfor-container">
                    <div class="personinfor-title">
                      Email:
                    </div>
                    <div class="personinfor-content personinfor-content-email">
                      {{ n.email }}
                    </div>
                  </v-row>
                  <v-row class="rest-row-ml personinfor-container">
                    <div class="personinfor-title">
                      Des:
                    </div>
                    <div class="personinfor-content personinfo-content-des">
                      {{
                        n.name ? n.name : '基努·李维'
                      }}出生在黎巴嫩首都贝鲁特，父亲是小山谬·诺林·李维（Samuel Nowlin Reeves
                      Jr.），母亲派翠西亚·庞德（Patricia
                      Bond），娘家姓泰勒（英语：Taylor）来自英格兰艾塞克斯郡。
                    </div>
                    <div class="personinfor-content personinfo-content-des">
                      他的父亲是夏威夷出生的美国人，祖母有中国、夏威夷、葡萄牙血统，而祖父是田纳西州出生的爱尔兰裔美国人。{{
                        n.name ? n.name : '基努·李维'
                      }}一词在夏威夷土语中的意思是吹过山头的清风。在他刚到好莱坞的时候，他的经纪人觉得他的名字太有异国情调了，因此在他早期的电影中他有时被叫作KC·李维（K.C.
                      Reeves）、诺曼·克李维斯（Norman Kreeves）、查克·士巴丹拿（Chuck
                      Spadina）。因为母亲的关系，他拥有英国国籍。
                    </div>
                    <div class="personinfor-content personinfor-content-des">
                      {{ n.name ? n.name : '基努·李维' }}的父亲虽然是美国公民，但由于{{
                        n.name ? n.name : '基努·李维'
                      }}并未在美国出生，并不能自动持有美国国籍，所以{{
                        n.name ? n.name : '基努·李维'
                      }}本人仅持有美国永久居留卡。他的妹妹金·李维（英语：Kim
                      Reeves），很喜欢养马，曾拍过电影[3]。
                      在1966年全家曾经前往澳洲生活了一年，在此期间他的妹妹金·李维出生，但他的父母在同一年离婚，{{
                        n.name ? n.name : '基努·李维'
                      }}三岁时，父亲离开了这对母子回到夏威夷。从那时起直到十三岁为止，李维有时会前往夏威夷看望父亲，但之后他与父亲两人已不再有任何关系了。父亲离家后，她母亲带著两个孩子搬家到了纽约，前后又搬了五次家，并改嫁给一位百老汇和好莱坞导演保罗·阿隆（Paul
                      Aaron）。但1970年，两人离婚后全家又搬到了加拿大多伦多。{{
                        n.name ? n.name : '基努·李维'
                      }}在那里长大，曾在餐厅、溜冰场打工，在中学的冰球队获得过最有价值球员称号，并取得加拿大公民权。在5年中他前后换过4所中学，并被其中的一所表演艺术学校开除。在他15岁时，{{
                        n.name ? n.name : '基努·李维'
                      }}在一个犹太人社区中心的舞台剧第一次登台表演，从此开始其演员生涯。
                    </div>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
      <v-item-group
        v-model="window"
        class="shrink mr-6 d-flex flex-sm-column flex-row"
        mandatory
        tag="v-flex"
      >
        <v-item v-for="n in persons" :key="n._id" v-slot:default="{ active, toggle }">
          <div>
            <v-btn :color="n.color" :input-value="active" icon @click="toggle">
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </div>
        </v-item>
      </v-item-group>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    // idx: {
    //   type: Number,
    //   default: null
    // }
  },
  data: () => ({
    idx: 0,
    dir: false, // 检测屏幕大小，当小于MD时，变成水平方向
    dotColors: ['#00ADBB', '#FF5959', '#004A97'],
    window: 0,
    persons: []
  }),
  created() {
    this.getCoaches()
  },
  mounted() {
    this.onResize()
  },
  methods: {
    async getCoaches() {
      try {
        const res = await this.$axios.$get('/coach')
        this.persons = res.list
        if (this.$route.query.name) {
          // TODO for in 不是有序的，所以不能直接用 idx 确定当前用户点击的用户信息
          this.persons.forEach((p, idx) => {
            const color = this.dotColors[Math.floor(Math.random() * 3)]
            p.color = color
            this.window = p.name === this.$route.query.name ? idx : this.window
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    onResize() {
      const width = { x: window.innerWidth, y: window.innerHeight }
      this.dir = !(width.x < 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.rest-row-ml {
  margin: 0;
  //   margin-right: 0;
}

// .box-shadow {
//   transition: all 0.3s ease;
//   &:hover {
//     @include card-hover-boxshadow;
//   }
// }

.personinfor {
  &-container {
    margin-bottom: 50px;
  }
  &-title {
    width: 100%;
    color: #807a7acc;
    font-size: 25px;
    font-weight: 300;
  }
  &-content {
    text-indent: 2cm;
    line-height: 30px;

    &-name,
    &-email {
      font-size: 30px;
      @media screen and (max-width: 600px) {
        font-size: 20px;
      }
    }
  }
}
</style>
