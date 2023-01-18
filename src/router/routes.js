
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Categories.vue') },
      { path: 'subcategories', component: () => import('pages/Subcategories.vue') },
      { path: 'products', component: () => import('pages/Products.vue')}
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', name: "login", component: () => import('src/pages/Login.vue')},
      { path: 'register', name: "register", component: () => import('src/pages/Register.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
