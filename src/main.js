import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// global css
import './assets/styles/index.scss'
import request from "@/utils/request";

Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.$request = request //显式的绑定

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')