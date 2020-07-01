import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      isNotAuthenticated(to,from,next);
    }
  },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/About.vue'),
      beforeEnter: (to, from, next) => {
        isAuthenticated(to,from,next);
      }

    },
    {
      path: '/test',
      name: 'Test',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Test.vue'),
      beforeEnter: (to, from, next) => {
        isAuthenticated(to,from,next);
      }
    },
    {
      path: '/access',
      name: 'Access',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Access.vue'),
      beforeEnter: (to, from, next) => {
        isAuthenticated(to,from,next);
      }
    },
]

const router = new VueRouter({
  mode: 'history', //todo hash or history mode
  base: process.env.BASE_URL,
  routes,
})

function isAuthenticated(to,from,next)
{
  if(sessionStorage.getItem("token"))
  {
    next();
  }
  else{
    next({
      name: "Login" // back to safety route //
    });
  }
}

function isNotAuthenticated(to,from,next) {
  {
    if(!sessionStorage.getItem("token"))
    {
      next();
    }
    else{
      next({
        name: "Access" // back to safety route //
      });
    }
  }

}

export default router
