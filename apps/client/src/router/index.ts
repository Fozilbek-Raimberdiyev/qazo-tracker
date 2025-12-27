import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/default/index.vue'
import { h, resolveComponent } from 'vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      name: 'authorized',
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: 'prayers',
          name: 'prayers',
          component: () => import('@/views/prayers/index.vue'),
        },
        {
          path: 'fasts',
          name: 'fasts',
          component: () => import('@/views/fasts/index.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/index.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: {
        render() {
          return h(resolveComponent('router-view'))
        },
      },
      name: 'unauhtorized',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/login/index.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/register/index.vue'),
        },

      ],
    },
     {
          path: '/oauth',
          name: 'oauth',
          component: {
            render() {
              return h(resolveComponent('router-view'))
            },
          },
          children : [
            {
              path : "success",
              name : "success",
              component : () => import("@/views/auth/oauth/success.vue")
            }
          ]
        },
  ],
})

export default router
