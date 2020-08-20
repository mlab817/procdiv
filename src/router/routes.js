
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
      { path: 'auth', component: () => import('pages/Auth.vue') },
      { path: 'for-opening', component: () => import('pages/ForOpening.vue') },
      { path: 'ongoing', component: () => import('pages/Ongoing.vue') },
      { path: 'ongoing-v2', component: () => import('pages/Ongoingv2.vue') },
      { path: 'completed', component: () => import('pages/Completed.vue') },
      { path: 'deleted', component: () => import('pages/Deleted.vue') },
      { path: 'options', component: () => import('pages/Options.vue') },
      { path: 'pr-pras', component: () => import('pages/PrPras.vue') },
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
