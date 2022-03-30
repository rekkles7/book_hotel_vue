import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import User from "@/views/system/user";
import {getToken} from "@/utils/auth";
import Hotel from "@/views/system/hotel"
import Room from "@/views/system/room"
import Order from "@/views/system/order"
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'system/user',
        name: 'User',
        component: User
      },
      {
        path: 'system/hotel',
        name: 'Hotel',
        component: Hotel
      },
      {
        path: 'system/room',
        name: 'Room',
        component: Room
      },
      {
        path: 'system/order',
        name: 'Order',
        component: Order
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//假如用户A没有登录，访问了Login页面
router.beforeEach((to, from, next) => {
  if (getToken() !== 'undefined' && getToken()){//已登录
    if (to.name === 'Login') next('/') // 如果访问的是登陆页面，直接跳转到主页
    else next() //想去哪里就去哪里
  }else if (to.name !== 'Login')
    //没有登录
    next({name:'Login'}) //如果不是登陆页面，重定向到登陆页面
  else next() //如果是登陆页面，就直接放行
})

export default router
