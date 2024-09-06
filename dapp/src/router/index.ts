import { createRouter, createWebHistory } from 'vue-router'
const DemoComponent  = import('@/components/DemoComponent.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/_wt/dapp',
      name: 'home',
      component: DemoComponent,
      props: { demoText: 'Hello World! (from router)' }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
