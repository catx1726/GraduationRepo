<template>
  <div class="article-container">
    <div class="search-box">
      <v-row class="d-flex flex-nowrap ">
        <div class="search-container d-flex align-center ">
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="message"
              label="Search "
              color="rgba(0,74,151,0.8)"
              class="search-css"
              single-line
              append-outer-icon="search"
              filled
              @click:append-outer="search"
            ></v-text-field>
          </v-col>
        </div>
      </v-row>
    </div>

    <div class="article-list d-flex flex-wrap">
      <div v-for="i in list" :key="i.name" class="article-item">
        <div class="d-flex ">
          <v-btn
            :to="'/article/' + i._id"
            text
            class="ar-title justify-start"
            style="height:auto;padding:0"
          >
            {{ i.title }}
          </v-btn>
        </div>
        <div class="ar-options">
          <!-- TODO 2020年4月18日 TZ时间处理公用方法 -->
          <span class="ar-time">Posted at {{ i.createdAt }}</span>
          <span class="ar-author">| Author:{{ i.user | articleAuthor }}</span>
        </div>
        <div class="ar-des">
          <!-- TODO 2020年4月18日 使用v-html会增大XSS攻击的几率，后台加一个字段 des -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div key="view" v-html="i.content"></div>
        </div>
      </div>
    </div>

    <div v-show="pageSize > 10" class="trigger-box">
      <div class="trigger-prev">
        <v-btn
          text
          class="justify-start"
          style="padding:0;"
          :color="curPage ? 'black' : 'grey'"
          :disabled="curPage ? false : true"
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
    <Transition />
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
    },
    articleAuthor(val) {
      // TODO 2020年4月18日 不知道为啥，模板中获取不到 i.user.name这个深度?
      if (val) {
        const { name } = val
        return name
      }
    }
  },

  data() {
    return {
      curPage: 1, // DES 只有当用户点击了 next 之后才会有 passPage
      pageSize: 0, // DES 所有文章的总数，一页只显示10篇
      restPage: 0, // DES 剩余页数
      // passPage: 0,
      message: '',
      list: []
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getArticleList()
  },

  methods: {
    async search() {
      try {
        const res = await this.$axios.$get('/article', { params: { key: this.message } })
        this.list = res.list
      } catch (error) {
        console.log(error)
      }
    },
    filterAndGet(res) {
      if (res.list) {
        res.list.forEach((item) => {
          item.createdAt = filterTZTime(item.createdAt)
        })
        this.list = res.list
        this.pageSize = res.count
        this.restPage = (this.pageSize - 10 * this.curPage) % 10
      }
    },
    async getArticleList() {
      try {
        const res = await this.$axios.$get('/article')
        this.filterAndGet(res)
        // this.list = res.list
        // this.pageSize = res.count
      } catch (error) {
        console.log(error)
      }
    },
    async next() {
      try {
        this.curPage++
        console.log(this.curPage)
        const res = await this.$axios.$get('/article', { params: { currentPage: this.curPage } })
        // this.list = res.list
        this.filterAndGet(res)
      } catch (error) {
        console.log(error)
      }
    },
    async prev() {
      try {
        this.curPage--
        const res = await this.$axios.$get('/article', { params: { currentPage: this.curPage } })
        // this.list = res.list
        this.filterAndGet(res)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rest-btn-pd {
  padding: 0;
}
.rest-btn-fl-al {
  align-content: flex-start;
}

.article-container {
  .article-list,
  .search-container,
  .trigger-box {
    margin-left: 20%;
    @media screen and(max-width: 1264px) {
      margin-left: 10%;
    }
    @media screen and(max-width: 600px) {
      margin-left: 5px;
    }
  }
  .trigger-box {
    width: 100px;
    display: flex;
    margin-top: 50px;

    .trigger-prev,
    .trigger-next {
      margin-right: 20px;
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
  .article-list .article-item {
    width: 100vw;
    padding-bottom: 20px;

    .ar-title {
      font-size: 50px;
      position: relative;
      text-indent: 0;

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
    .ar-des {
      width: 600px;
      height: 110px;
      overflow: hidden;
      transition: all 0.3s ease;
      &:hover {
        @include card-hover-boxshadow;
      }
      @media screen and (max-width: 600px) {
        width: 100vw;
      }
    }
  }
  .search-container {
    width: 100vw;
    @media screen and (max-width: 1920px) {
      height: 200px;
    }
    @media screen and (max-width: 960px) {
      height: 100px;
      margin-bottom: 0px;
    }
  }
}
</style>
