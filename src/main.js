import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import axios from './utils/request.js'

import './style/index.less'
import MyNav from '@/components/Bread-crumbs.vue'
import MyLa from '@/components/drop-down.vue'
import MyCover from '@/components/cover.vue'
// 引入组件 element-ui
Vue.use(ElementUI)
Vue.component('MyNav', MyNav)
Vue.component('MyLa', MyLa)
Vue.component('MyCover', MyCover)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
