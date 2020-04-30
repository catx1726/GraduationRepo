<template>
  <div class="commtent-container">
    <v-card
      v-for="item in commentList"
      :key="item._id"
      color="#26c6da"
      dark
      max-width="800"
      class="comment-card mb-2"
    >
      <v-card-text class="headline font-weight-bold">
        {{
          item.content ||
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.'
        }}
      </v-card-text>

      <v-card-actions>
        <v-list-item class="grow flex-wrap">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6"
              :src="
                item.user.avatar ||
                  'http://pic.baike.soso.com/p/20130731/20130731135826-406911917.jpg'
              "
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ item.user.name }}</v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end" class="patch">
            <!-- <v-icon class="mr-1">mdi-heart</v-icon>
            <span class="subheading mr-2">256</span>
            <span class="mr-1">·</span> -->
            <v-icon class="mr-1">mdi-clock</v-icon>
            <span class="subheading">{{ item.createdAt }}</span>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>

    <div class="trigger-box mx-auto">
      <div class="trigger-prev">
        <v-btn
          text
          class="justify-start"
          style="padding:0;"
          :color="curPage > 1 ? 'black' : 'grey'"
          :disabled="curPage > 1 ? false : true"
          @click="prev"
        >
          Prev
        </v-btn>
      </div>
      <div class="trigger-next">
        <v-btn
          text
          class="justify-start"
          style="padding:0;"
          :color="restPage > 0 ? 'black' : 'grey'"
          :disabled="restPage > 0 ? false : true"
          @click="next"
        >
          Next
        </v-btn>
      </div>
    </div>

    <!--
      TODO 2020年4月23日 字数这边要做限制，否则缩小的话，
           太长不便于阅读，且我给定了 max-width 800，不限制会有界面溢出情况
    -->
    <div class="input-container">
      <v-textarea v-model="inputText" filled label="Comment" counter :rules="rules"></v-textarea>
      <div class="trigger-box pb-5" style="margin:0">
        <v-btn text style="padding:0;" @click="submit">
          Submit
        </v-btn>
      </div>
    </div>
    <v-snackbar v-model="snackbar" bottom :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { filterTZTime } from '~/utils/common.ts'

export default {
  name: '',

  components: {},

  filters: {
    // OK 不知道为啥，用 filters 时 输出留言的话会一直触发，所以决定再拿回数据的时候处理
    timeFiler(val) {
      console.log(val)
      const time = filterTZTime(val)
      return time
    }
  },
  props: {},
  data() {
    return {
      rules: [(v) => v.length <= 200 || '不能超过200字'],
      commentList: [],
      inputText: '',
      snackbar: false,
      text: '',
      timeout: 2000,
      curPage: 1, // DES 只有当用户点击了 next 之后才会有 passPage
      pageSize: 0, // DES 所有文章的总数，一页只显示10篇
      restPage: 0 // DES 剩余页数
    }
  },
  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getCommentList()
  },

  methods: {
    filterAndGet(res) {
      if (res.list) {
        res.list.forEach((item) => {
          item.createdAt = filterTZTime(item.createdAt)
        })
        this.commentList = res.list
        this.pageSize = res.count
        this.restPage = (this.pageSize - 10 * this.curPage) % 10
      }
    },
    async getCommentList() {
      const res = await this.$axios.$get('/comment')
      this.filterAndGet(res)
    },
    async submit() {
      const valid = this.rules[0](this.inputText)
      // 1. 检测是否登录(后端也有检测，所以不用太担心)
      if (!this.$store.state.user.name) {
        this.snackbar = true
        this.text = '请先登录'
        return false
      }
      if (!this.inputText) {
        this.snackbar = true
        this.text = '写点什么吧'
        return false
      }
      if (valid !== true) {
        this.snackbar = true
        this.text = '字数可能超过限制了'
        return false
      }
      const commentObj = { topic: this.inputText.slice(0, 10), content: this.inputText }
      console.log(commentObj)
      const res = await this.$axios.$post('/comment', commentObj)
      this.snackbar = true
      this.text = res.message
      this.getCommentList()
      console.log(res)
    },
    async next() {
      try {
        this.curPage++
        console.log('next curPage:', this.curPage)
        const res = await this.$axios.$get('/comment', { params: { currentPage: this.curPage } })
        this.filterAndGet(res)
      } catch (error) {
        console.log(error)
      }
    },
    async prev() {
      try {
        this.curPage--
        console.log('prev curPage:', this.curPage)
        const res = await this.$axios.$get('/comment', { params: { currentPage: this.curPage } })
        this.filterAndGet(res)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.commtent-container {
  min-height: 1200px;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 100px;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 600px) {
    min-height: 600px;
  }

  .v-card {
    @media screen and (min-width: 800px) {
      width: 800px;
    }
    @media screen and (max-width: 799px) {
      width: 100%;
    }
    transition: all 0.3s ease;
    &:hover {
      @include card-hover-boxshadow;
    }
  }

  .input-container {
    // 普通情况下，直接继承 comment-container 的宽度
    // 也就是在小于 800px 的情况下
    width: 100%;
    padding-top: 50px;
    @media screen and(min-width:800px ) {
      width: 800px;
    }
  }

  .patch {
    // 在屏幕小于400px的时候
    // 将其 width 锁死为300px 让其换行显示
    // 且水平方向为 start
    @media screen and(max-width: 400px) {
      width: 300px;
      justify-content: flex-start !important;
      margin: 0;
    }
  }

  .trigger-box {
    width: 800px;
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;
    @media screen and(max-width: 799px) {
      width: 400px;
    }
    @media screen and(max-width: 400px) {
      width: 300px;
    }

    .trigger-prev,
    .trigger-next {
      position: relative;
      &::after {
        content: '';
        height: 3px;
        width: 15px;
        bottom: 5px;
        left: 0px;
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
  }
}
</style>
