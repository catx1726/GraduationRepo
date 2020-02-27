export default ({ $axios, redirect }) => {
  const axios = $axios
  // DES 基本配置
  axios.defaults.timeout = 10000
  axios.setBaseURL(process.env.API_URL)
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  console.log(axios)

  // 请求回调
  axios.onRequest((config) => {
    try {
      // TODO 2020年2月27日 这里 检查 和 配置 Token
      // if( token ){
      //   config.headers['Authorization'] = 'Bearer ' + token
      // }
      console.log('config:', config)
      return config
    } catch (error) {
      return error
    }
  })

  // DES 返回回调 处理响应
  axios.onResponse((res) => {
    console.log('res:', res)
    return res
  })

  // DES 错误回调
  axios.onError((error) => {
    console.log('error:', error)
    return error
  })

  // $axios.onRequest((config) => {
  //   console.log('Making request to ' + config.url)
  // })

  // $axios.onError((error) => {
  //   const code = parseInt(error.response && error.response.status)
  //   if (code === 400) {
  //     redirect('/400')
  //   }
  // })
}

// export default function(app) {

// }
