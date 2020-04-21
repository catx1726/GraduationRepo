<template>
  <div class="person-container">
    <v-card max-width="344" class="mx-auto">
      <v-window v-model="step">
        <!-- show start -->
        <v-window-item :value="1">
          <v-list-item>
            <v-list-item-avatar color="grey"></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ userInfo.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-img
            :src="userInfo.avatar || 'https://cdn.vuetifyjs.com/images/cards/mountain.jpg'"
            height="194"
          ></v-img>
          <v-card-text>
            {{ userInfo.des || '这里什么都没有' }}
          </v-card-text>
          <v-card-text>
            <v-chip-group active-class="deep-purple--text text--accent-4">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">Extra Soft</v-chip>
                </template>
                <span>这是你已经报名的活动</span>
              </v-tooltip>
            </v-chip-group>
          </v-card-text>
        </v-window-item>
        <!-- show end -->

        <!-- edit start -->
        <v-window-item :value="2">
          <v-card-text>
            <v-file-input
              v-model="img"
              accept="image/*"
              label="上传头像"
              prepend-icon="mdi-plus"
              append-icon="mdi-upload"
              @click:append="upload"
            ></v-file-input>
            <v-text-field v-model="changeUserInfo.name" maxlength="10" label="Name"></v-text-field>
            <v-text-field v-model="changeUserInfo.des" maxlength="30" label="Des"></v-text-field>
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
    async logout() {
      const res = await this.$store.dispatch('user/logout')
      if (res) {
        this.$router.push('/')
      }
      console.log('logout res:', res)
    },
    async upload() {
      const file = new FormData()
      console.log('upload ready', file, this.img)
      file.append('file', this.img, this.img.name)
      // 检测大小 类型已有原生节点控制
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        console.log('上传头像图片大小不能超过 2MB!')
        this.$store.dispatch('error/changeShow', { status: true, message: '大小不得超过2MB!' })
        return false
      }
      const res = await this.$axios.$post('/upload', file)
      console.log('upload img res:', res)
      this.changeUserInfo.avatar = res.url
    },
    submit() {
      try {
        if (this.step === 2) {
          // 提交更改，退出函数
          console.log(this.changeUserInfo, this.img)

          // const res = await this.$axios.$put('/user/edit', this.changeUserInfo)
          // this.text = res.message
          // this.snackbar = true
          // this.getPersonDetail()
          // this.step--
          // console.log('change person information res:', res)
          // return true
        }
        // 刚刚切换到修改界面
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
          this.userInfo = res
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
