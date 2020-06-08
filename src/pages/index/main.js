import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss' // global css
import App from './App.vue'
import router from './router.js'
import store from './store'
import * as filters from '@/filters' // global filters
import '@/icons' // icon
import './permission' // permission control

Vue.use(ElementUI);

Vue.config.productionTip = false

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
