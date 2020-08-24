
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
      { path: 'add-task', component: () => import('pages/AddTask.vue') },
      { path: 'assignments', component: () => import('pages/v1/Ongoing.vue') },
      { path: 'auth', component: () => import('pages/Auth.vue') },
      { path: 'for-opening', component: () => import('pages/ForOpening.vue') },
      { path: 'ongoing', component: () => import('pages/OngoingTasks.vue') },      
      { path: 'completed', component: () => import('pages/CompletedTasks.vue') },
      { path: 'deleted', component: () => import('pages/v1/Deleted.vue') },
      { path: 'options', component: () => import('pages/Options.vue') },
      { path: 'pr-pras', component: () => import('pages/PrPras.vue') },
      { path: 'trash', component: () => import('pages/DeletedTasks.vue') },
      { path: 'tasks/:id', component: () => import('pages/Task.vue') },
      { path: 'manage-users', component: () => import('pages/ManageUsers.vue') },
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
