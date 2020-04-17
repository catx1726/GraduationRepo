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
          <v-btn to="/coach" text class="ar-title justify-start" style="height:auto;padding:0">
            {{ i.title }}
          </v-btn>
        </div>
        <div class="ar-options">
          <span class="ar-time">Posted at {{ i.time }}</span>
          <span class="ar-author">| Author:{{ i.author }}</span>
        </div>
        <div class="ar-des">{{ i.des }}</div>
      </div>
    </div>
    <div class="trigger-box">
      <div class="trigger-prev">
        <v-btn text class="justify-start" style="padding:0;">Prev</v-btn>
      </div>
      <div class="trigger-next">
        <v-btn text class="justify-start" style="padding:0;">Next</v-btn>
      </div>
    </div>
    <Transition />
  </div>
</template>

<script>
import Transition from '~/components/Transition'

export default {
  name: '',
  components: {
    Transition
  },

  data() {
    return {
      message: '',
      list: [
        {
          title: 'Lorem',
          des:
            'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ,Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ',
          author: 'cad',
          time: '2020年4月17日'
        },
        {
          title: 'Lorem',
          des:
            'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ',
          author: 'cad',
          time: '2020年4月17日'
        },
        {
          title: 'Lorem',
          des:
            'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ',
          author: 'cad',
          time: '2020年4月17日'
        },
        {
          title: 'Lorem',
          des:
            'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ',
          author: 'cad',
          time: '2020年4月17日'
        },
        {
          title: 'Lorem',
          des:
            'Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem ',
          author: 'cad',
          time: '2020年4月17日'
        }
      ]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    search() {}
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
