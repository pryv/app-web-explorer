import Vue from "vue";

import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./cookies";
import "./axios";
import "./assets/css/style.css";
import "./jsoneditor";
import VueForceNextTick from "vue-force-next-tick";
Vue.config.productionTip = false;

import Pryv from "pryv";

Vue.prototype.$pryv = Pryv;
Vue.prototype.$sessionStorage = new Vue({
  data: {
    token_arr: window.sessionStorage.getItem("token_arr"),
    connection_arr: window.sessionStorage.getItem("connection_arr"),
    access_info_arr: window.sessionStorage.getItem("access_info_arr"),
    endpoint_arr: window.sessionStorage.getItem("endpoint_arr"),
  },
  watch: {
    token_arr(value) {
      window.sessionStorage.setItem("token_arr", value);
    },
    connection_arr(value) {
      window.sessionStorage.setItem("connection_arr", value);
    },
    access_info_arr(value) {
      window.sessionStorage.setItem("access_info_arr", value);
    },
    endpoint_arr(value) {
      window.sessionStorage.setItem("endpoint_arr", value);
    },
  },
});
Vue.use(VueForceNextTick);
// eslint-disable-next-line no-unused-vars
var vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
