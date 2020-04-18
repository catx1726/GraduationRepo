<template>
  <div>
    <div class="article-detail-container">
      <div class="back-button">
        <v-btn to="/activity" text>Back</v-btn>
      </div>
      <div class="ar-title">
        {{ act.name }}
      </div>
      <div class="ar-time ar-options">Posted at {{ act.createdAt | timeFilter }}</div>
      <div class="ar-content">
        <div class="ar-img">
          <v-img :src="act.img"></v-img>
        </div>
        <div class="ar-time" style="margin-bottom:10px">
          Time:
          <v-chip text outlined>{{ act.time }}</v-chip>
        </div>
        <div class="ar-coach">
          Coaches:
          <v-btn v-for="co in act.coaches" :key="co._id" text>{{ co.name }}</v-btn>
        </div>
        <div class="ar-des">Content: &nbsp;&nbsp;&nbsp;&nbsp; {{ act.content }}</div>
      </div>
    </div>
    <Transition style="margin-bottom:200px" />
  </div>
</template>

<script>
import Transition from '~/components/Transition'
import { filterTZTime } from '~/utils/common.ts'

export default {
  name: '',

  components: {
    Transition
  },
  filters: {
    timeFilter(val) {
      if (val) {
        const time = filterTZTime(val)
        return time
      }
    }
  },
  // async asyncData({ query, params, $axios }) {
  //   const { _id } = params
  //   params.id = _id
  //   const { one } = await $axios.$get(`/activities/${_id}`)
  //   return {
  //     act: one
  //   }
  // },
  data() {
    return {
      act: {},
      id: ''
    }
  },
  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {
    // eslint-disable-next-line no-unused-vars
    if (this.$route.params._id) {
      this.id = this.$route.params._id
      localStorage.setItem('tempActivityId', JSON.stringify(this.id))
    }
    // DES 放在 mounted 要注意大量数据时会卡顿
    this.getActivity()
  },

  created() {},
  methods: {
    async getActivity() {
      try {
        // OK 2020年4月18日 因为没有用 id 传值，导致刷新页面之后会丢失自定义的 _id
        const tempID = JSON.parse(localStorage.getItem('tempActivityId'))
        console.log('tempID:', tempID)
        const res = await this.$axios.$get(`/activities/${tempID}`)
        this.act = res.one
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.article-detail-container {
  margin-left: 20%;
  width: 100vw;
  padding-bottom: 200px;
  padding-top: 100px;
  @media screen and(max-width: 1264px) {
    margin-left: 10%;
  }
  @media screen and(max-width: 600px) {
    padding-bottom: 0px;
  }

  .ar {
    &-tile,
    &-content,
    &-time {
      margin-bottom: 30px;
    }
  }
  .ar-title {
    width: 800px;
    font-size: 50px;
    position: relative;
    @media screen and (max-width: 1000px) {
      font-size: 30px;
      padding-bottom: 5px;
      width: 90vw;
    }

    &::after {
      content: '';
      height: 5px;
      width: 30px;
      bottom: 5px;
      left: 3px;
      @include card-transform-bar; // 尽量使用可以GPU加速的属性
      transition: all 0.3s ease;
      position: absolute;
      background-color: #004a97cc;
    }
    &:hover {
      &::after {
        @include card-hover-bar;
      }
    }
  }
  .ar-options {
    font-size: 14px;
    color: grey;
  }
  .ar-content {
    font-size: 18px;
    width: 1000px;
    overflow: hidden;
    transition: all 0.3s ease;
    &:hover {
      @include card-hover-boxshadow;
    }
    @media screen and (max-width: 1000px) {
      width: 80vw;
    }
    .ar-coach,
    .ar-des {
      min-height: 50px;
      padding-bottom: 25px 0;
      position: relative;
      &::after {
        content: '';
        height: 5px;
        width: 30px;
        bottom: 15px;
        left: 3px;
        @include card-transform-bar; // 尽量使用可以GPU加速的属性
        transition: all 0.3s ease;
        position: absolute;
        background-color: #004a97cc;
      }
      &:hover {
        &::after {
          @include card-hover-bar;
        }
      }
    }
    // 单独修正button带来的多余高度
    .ar-coach::after {
      bottom: 13px;
    }
    .ar-time {
      padding-top: 25px;
    }
  }
}
</style>
