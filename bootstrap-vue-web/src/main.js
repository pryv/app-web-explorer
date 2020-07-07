import Vue from 'vue'

import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import Pryv from 'pryv'
Vue.prototype.$pryv = Pryv
Vue.prototype.$sessionStorage = new Vue({
  data: {
    token_arr : window.sessionStorage.getItem("token_arr"),
    connection_arr:window.sessionStorage.getItem('connection_arr'),
    access_info_arr:window.sessionStorage.getItem('access_info_arr')
  },
  watch:{
    token_arr(value){window.sessionStorage.setItem("token_arr", value)},
    connection_arr(value){ window.sessionStorage.setItem('connection_arr', value) },
    access_info_arr(value){window.sessionStorage.setItem('access_info_arr', value)}
    },
})

// eslint-disable-next-line no-unused-vars
var vm=new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
