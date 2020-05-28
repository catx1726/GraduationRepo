import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0f33d588 = () => interopDefault(import('..\\pages\\about\\index.vue' /* webpackChunkName: "pages_about_index" */))
const _1ceec050 = () => interopDefault(import('..\\pages\\activity\\index.vue' /* webpackChunkName: "pages_activity_index" */))
const _f2690c82 = () => interopDefault(import('..\\pages\\article\\index.vue' /* webpackChunkName: "pages_article_index" */))
const _325e8b4a = () => interopDefault(import('..\\pages\\coach\\index.vue' /* webpackChunkName: "pages_coach_index" */))
const _6e8c8cb6 = () => interopDefault(import('..\\pages\\comment\\index.vue' /* webpackChunkName: "pages_comment_index" */))
const _2dc0ad72 = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages_inspire" */))
const _fd01214c = () => interopDefault(import('..\\pages\\meeting\\index.vue' /* webpackChunkName: "pages_meeting_index" */))
const _5bdf7cec = () => interopDefault(import('..\\pages\\person\\index.vue' /* webpackChunkName: "pages_person_index" */))
const _4ce911c3 = () => interopDefault(import('..\\pages\\photo\\index.vue' /* webpackChunkName: "pages_photo_index" */))
const _5ed096b8 = () => interopDefault(import('..\\pages\\activity\\_id.vue' /* webpackChunkName: "pages_activity__id" */))
const _721adfe7 = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages_article__id" */))
const _8e14ff7c = () => interopDefault(import('..\\pages\\meeting\\_id.vue' /* webpackChunkName: "pages_meeting__id" */))
const _39525702 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _0f33d588,
    name: "about"
  }, {
    path: "/activity",
    component: _1ceec050,
    name: "activity"
  }, {
    path: "/article",
    component: _f2690c82,
    name: "article"
  }, {
    path: "/coach",
    component: _325e8b4a,
    name: "coach"
  }, {
    path: "/comment",
    component: _6e8c8cb6,
    name: "comment"
  }, {
    path: "/inspire",
    component: _2dc0ad72,
    name: "inspire"
  }, {
    path: "/meeting",
    component: _fd01214c,
    name: "meeting"
  }, {
    path: "/person",
    component: _5bdf7cec,
    name: "person"
  }, {
    path: "/photo",
    component: _4ce911c3,
    name: "photo"
  }, {
    path: "/activity/:id",
    component: _5ed096b8,
    name: "activity-id"
  }, {
    path: "/article/:id",
    component: _721adfe7,
    name: "article-id"
  }, {
    path: "/meeting/:id",
    component: _8e14ff7c,
    name: "meeting-id"
  }, {
    path: "/",
    component: _39525702,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
