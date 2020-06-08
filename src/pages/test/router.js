import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由
export default new VueRouter({
  mode: 'history',
  base: '/dgp',
  routes: [
    {
      path: '/',
      component: () => import('@/views/test/detail.vue'),
      children: [
        { path: 'test', component: () => import('@/views/test/detail.vue') },
      ],
    },
  ],
})
