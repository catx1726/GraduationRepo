/* eslint-disable no-unused-vars */
<template>
  <div class="coach-container">
    <div class="cards-title d-flex justify-start align-center">
      <span>
        The Coaches
      </span>
      <div class="card-trigger ">
        <v-btn class="ma-2" text :disabled="prevLock" @click="prev">
          <v-icon
            :color="prevLock ? 'grey' : 'black'"
            size="30"
            v-text="'mdi-chevron-left'"
          ></v-icon>
        </v-btn>
        <v-btn class="ma-2" text :disabled="nextLock" @click="next">
          <v-icon
            :color="nextLock ? 'grey' : 'black'"
            size="30"
            v-text="'mdi-chevron-right'"
          ></v-icon>
        </v-btn>
      </div>
    </div>
    <!-- TODO 这里只展示三位教练 -->
    <div>
      <ul ref="coachCards" v-resize="onResize" class="coach-box">
        <li v-for="(co, index) in coaches" :key="index">
          <v-card max-width="350" max-height="370" style="margin:0px 20px 20px 5px;">
            <v-list-item>
              <!-- TODO 教练头像 -->
              <v-list-item-avatar color="grey">
                <v-img class="elevation-6" :src="co.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ co.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- TODO 一张更大的教练图 -->
            <v-img :src="co.avatar" height="194"></v-img>

            <v-card-text>Email: {{ co.email }}</v-card-text>

            <v-card-actions>
              <v-btn text color="deep-purple accent-4" :to="'/coach/?name=' + co.name">
                More
              </v-btn>

              <v-spacer></v-spacer>
              <v-btn icon :color="heart ? 'red' : 'grey'" @click="coachHeart">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  components: {},
  props: [],
  data() {
    return {
      heart: false,
      winSize: { x: 0, y: 0 },
      showedNums: 0,
      restNums: 0,
      clickNums: 0,
      prevLock: true, // 上一张默认是锁着的
      nextLock: false, // 下一张默认不锁哈
      iOConfig: { rootMargin: '100px' },
      coaches: [
        {
          name: 'cad1',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad2',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad3',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad4',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad5',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad6',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        },
        {
          name: 'cad7',
          ava: '/imgs/temp-person-icon.png',
          pho: '/imgs/temp-person-img.jpeg',
          age: '18',
          des: '我会教你游泳，直到永远'
        }
      ]
    }
  },

  computed: {},

  watch: {
    coaches() {
      this.onResize()
    }
  },
  created() {
    this.getCoachesList()
  },
  beforeMount() {},
  mounted() {
    // DES 1. DOM加载完成，获取一次宽度，求能展示的个数
    // DES 2. window.size 改变，在获取一次宽度，求能展示的个数
    this.onResize()
  },

  methods: {
    async getCoachesList() {
      try {
        const res = await this.$axios.$get('/coach')
        this.coaches = res.list
        // DES 获取到数据之后 更新 slid 数据，放这里会报错 window undefined created 时候 DOM未加载
        // this.onResize()
      } catch (error) {
        console.log(error)
      }
    },
    coachHeart(val) {
      val.target.style.color = val.target.style.color === 'red' ? 'grey' : 'red'
    },
    onResize() {
      this.winSize = { x: window.innerWidth, y: window.innerHeight }
      // DES 375 是单个卡片最大 width *.8 是因为 margin-left: 20vw
      // DES 拿到当前宽度下，能安全显示的个数(最多显示几个)
      this.showedNums = Math.floor((this.winSize.x * 0.8) / 375)
      // DES 拿到剩余张数
      this.restNums = this.coaches.length - this.showedNums
    },
    next() {
      // DES 首先要有剩余的张数，其次点击的次数要小于剩下的张数
      if (this.restNums > 0 && this.clickNums < this.restNums) {
        this.prevLock = false
        this.clickNums++
        this.$refs.coachCards.style.marginLeft = -375 * this.clickNums + 'px'
      } else {
        this.nextLock = true
        // DES 清空 click
        // this.clickNums = 0
        return false
      }
    },
    prev() {
      // DES 只有点击了下一张，才能点击上一张
      if (this.clickNums > 0) {
        this.clickNums--
        this.nextLock = false
        this.$refs.coachCards.style.marginLeft = -375 * this.clickNums + 'px'
      } else {
        this.prevLock = true
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.coach {
  &-container {
    height: 800px;
    margin-left: 20vw;
    overflow: hidden;
    @media screen and (max-width: 700px) {
      margin-left: 0;
      height: 700px;
    }
    .coach-box {
      height: 370px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-start;
      transition: all 0.3s ease;

      @media screen and (max-width: 700px) {
        font-size: 28px;
        // margin: 50px 0;
        justify-content: center;
      }

      padding-left: 0; // reset ul
      li {
        list-style-type: none;
      }
    }
    .cards-title {
      font-size: 56px;
      font-weight: bolder;
      margin: 50px 0;
      position: relative;
      @media screen and (max-width: 700px) {
        font-size: 28px;
        // margin: 50px 0;
      }
    }
    .card-trigger {
      position: absolute;
      right: 15%;
      @media screen and (max-width: 900px) {
        right: 0;
      }
    }
  }
}
</style>
