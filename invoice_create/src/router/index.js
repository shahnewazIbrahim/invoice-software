import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: import('../views/Dashboard.vue')
    },
    {
      path: '/invoices/create',
      name: 'invoice-create',
      component: import('../views/InvoiceCreate.vue')
    },
    {
      path: '/invoices',
      name: 'invoices',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InvoiceList.vue')
    },
  ]
})

export default router
