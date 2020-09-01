import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";
import axios from "axios";
import VueAxios from "vue-axios";
import Pryv from "pryv";
import VJsoneditor from "v-jsoneditor";
import "./assets/css/style.css";

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
    endpoint_arr: window.sessionStorage.getItem("endpoint_arr"),
  },
  watch: {
    endpoint_arr(value) {
      window.sessionStorage.setItem("endpoint_arr", value);
    },
  },
});

// jQuery is required by bootstrap to work
window.$ = window.jQuery = require("jquery");
require("popper.js");
require("bootstrap");
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/regular.css";
import "@fortawesome/fontawesome-free/css/solid.css";
window.jQuery.extend(true, window.jQuery.fn.datetimepicker.defaults, {
  icons: {
    time: "far fa-clock",
    date: "far fa-calendar",
    up: "fas fa-arrow-up",
    down: "fas fa-arrow-down",
    previous: "fas fa-chevron-left",
    next: "fas fa-chevron-right",
    today: "fas fa-calendar-check",
    clear: "far fa-trash-alt",
    close: "far fa-times-circle",
  },
});
// eslint-disable-next-line no-unused-vars
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
