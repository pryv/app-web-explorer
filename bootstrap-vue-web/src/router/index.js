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
  },
    {
      path: '/access',
      name: 'Access',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '../views/Access.vue'),
    },
]

const router = new VueRouter({
  mode: 'hash', //todo hash or history mode
  base: process.env.BASE_URL,
  routes,
  computed:{

  }
})

// eslint-disable-next-line no-unused-vars
function isAuthenticated(to,from,next,that)
{
  if(!Vue.$sessionStorage)
  {
    next({
      name: "Home" // back to safety route //
    });
  }
  else{
    if(Vue.$sessionStorage.connection_arr && Vue.$sessionStorage.access_info_arr)
    {
      next({
        name: "Access" // back to safety route //
      });
    }
    else{
      next({
        name: "Home" // back to safety route //
      });
    }
  }

}

// eslint-disable-next-line no-unused-vars
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
