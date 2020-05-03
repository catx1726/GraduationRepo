<template>
  <div>
    <div class="article-detail-container">
      <div class="back-button">
        <v-btn to="/article" text>Back</v-btn>
      </div>
      <div class="ar-title">
        {{ article.title }}
      </div>
      <div class="ar-time ar-options">Posted at {{ article.createdAt | timeFilter }}</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="ar-content" v-html="article.content"></div>
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
      console.log(val)
      const time = filterTZTime(val)
      return time
    }
  },

  async asyncData({ params, $axios }) {
    const { id } = params
    const { article } = await $axios.$get(`/article/${id}`)
    return {
      article
    }
  },

  // props: {
  //   id: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data() {
    return {}
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
    border-left: 5px solid rgba(0, 74, 151, 0.8);
    padding-left: 10px;
    width: 40vw;
    @media screen and(max-width: 1264px) {
      width: 60vw;
    }
    @media screen and(max-width: 960px) {
      width: 90vw;
    }
    overflow: hidden;
    transition: all 0.3s ease;
    &:hover {
      @include card-hover-boxshadow;
    }
    @media screen and (max-width: 1000px) {
      width: 80vw;
    }
  }
}
</style>
