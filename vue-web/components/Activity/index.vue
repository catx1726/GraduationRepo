<template>
  <div class="activity-container">
    <!-- <div class="d-flex flex-wrap justify-sm-end justify-center">
      <div
        v-for="box in colorBox"
        :key="box.url"
        class="d-flex align-end justify-start box-one"
        :style="'background-color:' + box.bgcolor"
      >
        <v-btn
          text
          color="white"
          class="intro-link headline"
          style="margin-bottom:35px"
          :to="box.url"
        >
          {{ box.url }}
        </v-btn>
      </div>
    </div> -->

    <div class="cards-container d-flex flex-column">
      <div class="cards-title d-flex justify-start align-center">
        <span>
          The Activities
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
      <div ref="cards" class="cards-list d-flex flex-wrap justify-sm-start justify-center">
        <v-card
          v-for="(card, i) in activities"
          :key="card.name"
          style="margin:0px 20px 20px 5px;"
          class="card-slide"
          max-width="350"
          max-height="400"
        >
          <v-img class="white--text align-end" height="200px" :src="card.img">
            <v-card-title>{{ card.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">coach: {{ card.coaches | coachesName }}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>
              {{ card.content }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="orange"
              text
              :to="{ name: 'activity-id', params: { id: i, _id: card._id } }"
            >
              More
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#FF5959" text @click="apply(card._id)">
              Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar" top :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: '',

  components: {},
  filters: {
    coachesName(value) {
      // console.log('filters coaches name:', value)
      let names = ''
      if (value) {
        value.forEach((i) => {
          names += i.name + ' '
        })
      }
      return names
    }
  },
  props: [],
  data() {
    return {
      timeout: 2000,
      snackbar: false,
      text: '',
      idx: 0, // 监听 next 次数
      colorBox: [
        { url: 'activity', bgcolor: '#FF5959' },
        { url: 'coach', bgcolor: '#004A97' },
        { url: 'photo', bgcolor: '#00ADBB' }
      ],
      // 届时 index页 只让显示 10条活动信息
      activities: [
        {
          name: 'LOREM1',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM2',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM3',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM4',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM5',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM6',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM7',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM8',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM9',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        },
        {
          name: 'LOREM10',
          nums: 50,
          coach: 'cad',
          content: ' consectetur adipisicing elit.',
          img: 'https://composeclick.com/wp-content/uploads/2018/04/marco-meyer-598648-unsplash.jpg'
        }
      ],
      actLen: 0,
      nextLock: false,
      prevLock: true
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getActivitiesList()
  },
  beforeMount() {},
  mounted() {},
  methods: {
    async apply(id) {
      // 1. 检测是否登录(后端也有检测，所以不用太担心)
      if (!this.$store.state.user.name) {
        this.snackbar = true
        this.text = '请先登录'
        return false
      }
      // 2. 拿到活动ID，push到当前用户的activitys中去
      const userInfo = await this.$store.dispatch('user/getUserInfo')
      userInfo.activitys.push(id)
      // console.log('userInfo:', userInfo)
      const res = await this.$axios.$post(`/activities/${id}`, userInfo)
      this.snackbar = true
      this.text = res.message
      return true
      // console.log('apply activity _id:', id, 'res:', res)
    },
    async getActivitiesList() {
      try {
        const data = await this.$axios.$get('/activities')
        this.activities = data.list
        this.actLen = this.activities.length
      } catch (error) {
        console.log(error)
      }
    },
    prev() {
      if (!this.idx) {
        this.prevLock = true
        return
      }
      this.idx--
      this.nextLock = false
      this.$refs.cards.style.marginLeft = -375 * this.idx + 'px'
    },
    next() {
      if (this.actLen - this.idx <= 1) {
        console.log('没有更多了')
        this.nextLock = true
        return
      }
      this.idx++
      this.prevLock = false
      this.$refs.cards.style.marginLeft = -375 * this.idx + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-container {
  height: 1000px;
  overflow: hidden;
  @media screen and (max-width: 700px) {
    height: 900px;
  }
}
.box {
  &-one,
  &-two,
  &-three {
    height: 250px;
    width: 250px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    position: relative;
    &::after {
      content: '';
      height: 5px;
      width: 30px;
      bottom: 15px;
      left: 15px;
      @include card-transform-bar; // 尽量使用可以GPU加速的属性
      transition: all 0.3s ease;
      position: absolute;
      background-color: white;
    }
    &:hover {
      @include card-hover-boxshadow;
      &::after {
        @include card-hover-bar;
      }
    }

    @media screen and (max-width: 800px) {
      height: 100px;
      width: 100vw;
    }
  }
}

.cards-container {
  margin-left: 20vw;
  overflow: hidden;
  right: 0;
  position: relative;
  @media screen and (max-width: 700px) {
    margin: 0;
  }
}
.cards-list {
  height: 340px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.card-slide {
  transition: all 0.3s ease;
}

.cards-title {
  font-size: 56px;
  font-weight: bolder;
  margin: 50px 0;
  position: relative;
  @media screen and (max-width: 700px) {
    font-size: 28px;
  }
}
.card-trigger {
  position: absolute;
  right: 15%;
  @media screen and (max-width: 900px) {
    right: 0;
  }
}
</style>
