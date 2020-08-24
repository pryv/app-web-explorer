import Vue from 'vue';

import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Pryv from 'pryv';
import VJsoneditor from 'v-jsoneditor';
import './assets/css/style.css';

Vue.config.productionTip = false;
//import axios
Vue.use(VueAxios, axios);
//import cookies
Vue.use(VueCookies);
//import json editor
Vue.use(VJsoneditor);

Vue.prototype.$pryv = Pryv;
Vue.prototype.$sessionStorage = new Vue({
  data: {
    endpoint_arr: window.sessionStorage.getItem('endpoint_arr'),
  },
  watch: {
    endpoint_arr(value) {
      window.sessionStorage.setItem('endpoint_arr', value);
    },
  },
});
// eslint-disable-next-line no-unused-vars
var vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
