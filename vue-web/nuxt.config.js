import { resolve } from 'path'
import colors from 'vuetify/es5/util/colors'
import dotenv from 'dotenv'

dotenv.config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],
  styleResources: {
    scss: './assets/scss/mixin.scss' // https://zh.nuxtjs.org/api/configuration-build/#styleresources
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios.js', // 指定 axios 配置文件
    '~/plugins/svg-icon.js'
    // ssr: false 默认: true on universal 模式 或 false on spa 模式
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
    // '@nuxtjs/auth'
  ],
  // auth: {
  //   // Options
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: { url: '/auth/login', propertyName: 'token' },
  //         logout: { url: '/auth/logout' },
  //         user: { url: '/auth/user', propertyName: 'user' }
  //       }
  //       // tokenRequired: true,
  //       // tokenType: 'bearer'
  //       // autoFetchUser: true
  //     }
  //   }
  // },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true, // 代理
    prefix: process.env.API_URL || 'localhost:3000'
    // credentials: true
  },
  proxy: {
    changeOrigin: true // 是否跨域
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // 排除 nuxt 使用vue-loader 处理 svg / img 的错误
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))
      svgRule.exclude = [resolve(__dirname, 'assets/icons/svg')]

      // 添加 svg-sprit-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [resolve(__dirname, 'assets/icons/svg')],
        use: [{ loader: 'svg-sprite-loader', options: { symbolId: 'icon-[name]' } }]
      })
    }
  }
}
