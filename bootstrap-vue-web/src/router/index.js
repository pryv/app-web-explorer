import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Home.vue'),
  },
  {
    path: '/home',
    name: 'Main',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/events',
    name: 'Events',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Events.vue'),
  },
  {
    path: '/info',
    name: 'Info',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Info.vue'),
  },
  {
    path: '/stream',
    name: 'Stream',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Stream.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  computed: {},
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition);
    return { x: 0, y: 0 };
  },
});

export default router;
