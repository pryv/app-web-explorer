import Vue from 'vue'

import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import Pryv from 'pryv'
Vue.prototype.$pryv = Pryv
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
