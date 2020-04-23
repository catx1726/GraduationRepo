<template>
  <div class="person-container">
    <v-card max-width="344" class="mx-auto">
      <v-window v-model="step">
        <!-- show start -->
        <v-window-item :value="1">
          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img
                :src="
                  userInfo.avatar ||
                    'http://pic.baike.soso.com/p/20130731/20130731135826-406911917.jpg'
                "
                alt="CAD"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ userInfo.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ userInfo.email || 'catx1726@foxmail.com' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-img
            :src="userInfo.avatar || 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg'"
            height="194"
          ></v-img>
          <v-card-text>
            {{ userInfo.des || '这里什么都没有' }}
          </v-card-text>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-card-text>
                <v-chip-group active-class="deep-purple--text text--accent-4">
                  <v-chip v-for="ac in userInfo.activitys" :key="ac" v-on="on">
                    {{ ac }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </template>
            <span>这是你已经报名的活动</span>
          </v-tooltip>
        </v-window-item>
        <!-- show end -->

        <!-- edit start -->
        <v-window-item :value="2">
          <v-card-text>
            <v-img
              :src="changeUserInfo.avatar || 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg'"
              height="194"
            ></v-img>
            <v-file-input
              v-model="img"
              accept="image/*"
              label="上传头像"
              prepend-icon="mdi-plus"
              append-icon="mdi-upload"
              @click:append="upload"
            ></v-file-input>
            <v-text-field v-model="changeUserInfo.name" maxlength="10" label="Name"></v-text-field>
            <v-text-field v-model="changeUserInfo.email" label="Email"></v-text-field>
            <v-textarea
              v-model="changeUserInfo.des"
              label="Des"
              auto-grow
              :value="changeUserInfo.des || '介绍一下你自己吧'"
            ></v-textarea>
          </v-card-text>
        </v-window-item>
        <!-- edit end -->
      </v-window>

      <v-card-actions>
        <v-btn v-show="step === 2" text color="#004A97" @click="step--">
          Back
        </v-btn>
        <v-btn v-show="step === 1" text color="red" @click="logout">
          Logout
        </v-btn>
        <v-btn text color="#00ADBB" @click="submit">
          {{ step === 1 ? 'Change' : 'Submit' }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon :color="redHeart ? 'red' : 'grey'" @click="redHeart = !redHeart">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="#00ADBB">
      {{ text }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <Transition style="margin-top:100px" />
  </div>
</template>

<script>
import Transition from '@/components/Transition'
export default {
  name: '',

  components: { Transition },
  props: {},
  data() {
    return {
      img: null,
      text: '',
      snackbar: false,
      timeout: 2000,
      triggerOn: { activity: false, des: false, avatar: false },
      userInfo: {},
      redHeart: false,
      change: false,
      step: 1,
      email: '',
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      changeUserInfo: {}
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getPersonDetail()
  },

  methods: {
    repeatCheck(list) {
      const pureList = []
      if (!list.activitys) {
        return true
      }
      list.activitys.forEach((i) => {
        if (!pureList.includes(i.name)) {
          pureList.push(i.name)
        }
      })
      list.activitys = pureList
      return list
    },
    async logout() {
      const res = await this.$store.dispatch('user/logout')
      if (res) {
        this.$router.push('/')
      }
      console.log('logout res:', res)
    },
    uploadCheck() {
      // 检测大小 类型已有原生节点控制
      if (!this.img) {
        this.$store.dispatch('error/changeShow', { status: true, message: '请先添加图片!' })
        return false
      }

      const file = this.img
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        console.log('上传头像图片大小不能超过 2MB!')
        this.$store.dispatch('error/changeShow', { status: true, message: '大小不得超过2MB!' })
        return false
      }

      return true
    },

    async upload() {
      const check = this.uploadCheck()
      if (!check) {
        return false
      }
      const formData = new FormData()
      formData.append('file', this.img, this.img.name)
      const res = await this.$axios.$post('/upload', formData)
      this.text = '上传成功'
      this.snackbar = true
      console.log('upload img res:', res)
      this.changeUserInfo.avatar = res
    },
    async submit() {
      try {
        if (this.step === 2) {
          // 提交更改，退出函数
          const res = await this.$axios.$put('/user/edit', this.changeUserInfo)
          this.text = res.message
          this.snackbar = true
          this.getPersonDetail()
          this.step--
          console.log('change person information res:', res)
          return true
        }
        // 刚刚切换到修改界面
        // 防止用户提交空值， 在这里直接拿到 show 的数据
        this.changeUserInfo = Object.assign({}, this.userInfo)
        this.step++
      } catch (e) {
        const message = e.response.data.message || e.response.data.error
        this.$store.dispatch('error/changeShow', { status: true, message })
      }
    },
    getPersonDetail() {
      this.$store
        .dispatch('user/getUserInfo')
        .then((res) => {
          console.log('userInfo res:', res)
          // DES 因为在 created 阶段调用了此方法，代码如果过于臃肿会导致速度很慢
          this.userInfo = this.repeatCheck(res)
        })
        .catch((e) => {
          const message = e.response.data.message || e.response.data.error
          this.$store.dispatch('error/changeShow', { status: true, message })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.person-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 150px;
  // align-items: center;
  // @media screen and(max-width: 1920px) {
  //   height: 1200px;
  // }
  // @media screen and(max-width: 1264px) {
  //   height: 800px;
  // }
  // @media screen and(max-width: 960px) {
  //   height: 600px;
  // }
}
</style>
