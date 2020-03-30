import Vue from 'vue'
import SvgIcon from '@/components/Icons/SvgIcon'

Vue.component('svg-icon', SvgIcon)

// 预请求 svg 组件 需要使用 svg-sprit-loader 来返回文件
// require 是 webpack 中的方法
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)
