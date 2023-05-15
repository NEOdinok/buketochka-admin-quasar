const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {requiresAuth: true},
    children: [
      { path: '', component: () => import('src/pages/Categories.vue') },
      { path: 'subcategories', component: () => import('pages/Subcategories.vue') },
      {
        path: 'products',
        children: [
          { path: '', name: "products", component: () => import('pages/ProductList.vue') },
          { path: 'edit/:id', name: "editProduct", component: () => import('pages/ProductPage.vue') },
          { path: 'create', name: "createProduct", component: () => import('pages/CreateProductPage.vue') },
        ],
      },
      // { path: '/create-product', name: "createProduct", component: () => import('pages/ProductPage.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', name: "login", component: () => import('src/pages/Login.vue') },
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', name: "register", component: () => import('src/pages/Register.vue') }
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
