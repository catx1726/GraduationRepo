<template>
  <div class="activity-container">
    <div class="d-flex flex-wrap justify-sm-end justify-center">
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
    </div>

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
          v-for="card in activities"
          :key="card.name"
          style="margin:0px 20px 20px 5px;"
          class="card-slide"
          max-width="350"
          max-height="400"
        >
          <v-img class="white--text align-end" height="200px" :src="card.img">
            <v-card-title>{{ card.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">coach: {{ card.coach }}</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>
              {{ card.content }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="orange" text>
              Share
            </v-btn>

            <v-btn color="orange" text>
              Explore
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- <v-card
          v-for="card in activities"
          :key="card.name"
          max-width="350"
          max-height="400"
          style="margin:0px 20px 20px 5px;"
          class="card-slide"
        >
          <v-list-item>
            <v-list-item-avatar color="grey"></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ card.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ card.coach }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img :src="card.img" height="194"></v-img>

          <v-card-text>
            {{ card.content }}
          </v-card-text>

          <v-card-actions>
            <v-btn text color="deep-purple accent-4">
              Read
            </v-btn>
            <v-btn text color="deep-purple accent-4">
              Bookmark
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card> -->
      </div>
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
  beforeMount() {},
  mounted() {
    // 在真实 DOM 渲染完成时 获取到 actLen
    this.actLen = this.activities.length
    console.log(this.actLen)
  },
  methods: {
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
