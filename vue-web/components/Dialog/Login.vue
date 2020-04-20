<template>
  <div class="login-dialog">
    <v-dialog v-model="dialog" max-width="600px" class="mx-auto" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ step === 1 ? '登录' : '注册' }}</span>
        </v-card-title>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-form ref="loginForm" v-model="valid">
                <v-text-field
                  v-model="userInfo.name"
                  label="Name"
                  :rules="loginNameRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.password"
                  label="Password"
                  :rules="loginPasswordRules"
                  autocomplete="your-password"
                  type="password"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-form ref="regForm" v-model="valid">
                <v-text-field
                  v-model="userInfo.name"
                  label="Username"
                  type="username"
                  required
                  :rules="regNameRules"
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.password"
                  label="Password"
                  type="password"
                  autocomplete="your-password"
                  required
                  :rules="regPasswordRules"
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.repassword"
                  label="Confirm Password"
                  type="password"
                  :rules="rePasswordRules"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  Please enter a password for your account
                </span>
              </v-form>
            </v-card-text>
          </v-window-item>
        </v-window>
        <v-card-actions>
          <v-btn color="blue darken-1" text :disabled="step === 1" @click="trigger('back')">
            返回
          </v-btn>

          <v-btn color="blue darken-1" text :disabled="step === 2" @click="trigger('reg')">
            注册
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text :disabled="!valid" @click="submit">
            提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'

export default {
  name: '',

  components: {},
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1,
      valid: false,
      loginValid: false,
      regValid: false,
      loginNameRules: [
        (v) => !!v || '名字是必须的',
        (v) => (v && v.length <= 10) || '长度不得大于10'
      ],
      loginPasswordRules: [
        (v) => !!v || '密码是必须的',
        (v) => (v && v.length >= 3) || '长度不得小于3'
      ],
      regNameRules: [
        (v) => !!v || '名字是必须的',
        (v) => (v && v.length <= 10) || '长度不得大于10'
      ],
      regPasswordRules: [
        (v) => !!v || '密码是必须的',
        (v) => (v && v.length >= 3) || '长度不得小于3'
      ],
      userInfo: { name: '', password: '' }
    }
  },

  computed: {
    rePasswordRules() {
      if (this.userInfo.password !== this.userInfo.repassword) {
        return ['密码不一致']
      }
      return [true]
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    async submit() {
      if (!this.valid) {
        console.log('请检查输入项')
        return false
      }
      // DES 点击之后提交完成之前无法再次触发
      this.valid = false
      await this.$store.dispatch('user/login', this.userInfo)
      this.$emit('update:dialog', !this.dialog)
    },
    trigger(str) {
      // 1. 清空校验规则
      // 2. 检测是前进还是后退
      if (str === 'reg') {
        this.$refs.loginForm.reset()
        this.step++
        this.valid = false
      }
      if (str === 'back') {
        this.$refs.regForm.reset()
        this.step--
        this.valid = false
      }
    },
    close() {
      this.step = 1
      this.$emit('update:dialog', !this.dialog)
    }
  }
}
</script>
<style lang="" scoped></style>
