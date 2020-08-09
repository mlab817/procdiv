
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
      { path: 'auth', component: () => import('pages/Auth.vue') },
      { path: 'ongoing', component: () => import('pages/Ongoing.vue') },
      { path: 'completed', component: () => import('pages/Completed.vue') },
      { path: 'deleted', component: () => import('pages/Deleted.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
