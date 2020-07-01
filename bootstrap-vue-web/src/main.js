import Vue from 'vue'

import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import Pryv from 'pryv'
Vue.prototype.$pryv = Pryv

Vue.prototype.$sessionStorage = new Vue({
  data: { token: window.sessionStorage.getItem('token') },
  watch:{ token(value){ window.sessionStorage.setItem('token', value) } },
})

// eslint-disable-next-line no-unused-vars
var vm=new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
