<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          v-if="loggedIn"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Purchasing
        </q-toolbar-title>

        <q-space/>

        <q-btn flat round icon="notifications" color="grey-9" @click="rightDrawerOpen = !rightDrawerOpen" v-if="loggedIn">
          <q-badge color="red" floating>
            {{Object.keys(notifications).length}}
          </q-badge>
          <q-tooltip>Notifications</q-tooltip>
        </q-btn>
        <q-btn flat stretch icon="person" label="Login" to="/auth" v-if="!loggedIn"></q-btn>
        <q-btn flat stretch icon-right="exit_to_app" :label="$q.screen.lt.sm ? void 0 : 'Logout'" v-else @click="confirmLogout">
          
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      bordered
      content-class="bg-primary"
      v-if="loggedIn"
      show-if-above
    >
      
      <q-img class="absolute-top" style="height: 200px" src="https://cdn.quasar.dev/img/material.png">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="user ? user.photoURL : ''" />
          </q-avatar>
          <div class="text-weight-bold text-uppercase">
            {{ user ? user.displayName : '' }}
          </div>
          <div>@{{ user ? user.email : '' }}</div>
        </div>
      </q-img>

      <q-scroll-area style="height: calc(100% - 200px); margin-top: 200px; border-right: 1px solid #ddd">

        <q-list dark class="text-grey-4">
          <q-item-label header>
            Navigation
          </q-item-label>
          <q-item clickable tag="a" exact to="/">
            <q-item-section avatar>
              <q-icon name="dashboard"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" exact to="/assignments" v-if="Object.keys(ongoing).length">
            <q-item-section avatar>
              <q-icon name="priority_high"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>Assignments<q-badge floating color="negative">deprecated</q-badge></q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" exact to="/add-task">
            <q-item-section avatar>
              <q-icon name="add_task"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>Add Task</q-item-label>
            </q-item-section>
          </q-item>
          <q-expansion-item label="Tasks" icon="folder" :default-expand-all="$q.screen.gt.sm" :content-inset-level="1">
            <q-item clickable tag="a" to="/ongoing">
              <q-item-section avatar>
                <q-icon name="code"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Ongoing</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" to="/completed">
              <q-item-section avatar>
                <q-icon name="check"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Completed</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" to="/trash">
              <q-item-section avatar>
                <q-icon name="delete"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Trash</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator color="grey-3" />
            <q-item clickable tag="a" exact to="/for-opening">
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>
              <q-item-section>
                <q-item-label>For Opening</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item clickable tag="a" to="/manage-users" exact v-if="admin">
            <q-item-section avatar>
              <q-icon name="supervisor_account" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Users</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" to="/options" exact v-if="admin">
            <q-item-section avatar>
              <q-icon name="unfold_more" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Manage Options</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-item clickable tag="a" to="/settings" exact>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Settings</q-item-label>
            </q-item-section>
          </q-item> -->
          <q-item>
            <download-task></download-task>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <div class="q-pa-sm">
        <div class="text-h6">Notifications</div>
      </div>
      <notifications-list></notifications-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="loggedIn">
      <q-tabs>
        <q-route-tab
          v-for="nav in essentialLinks"
          :key="nav.label"
          :to="nav.link"
          :icon="nav.icon"
          :label="nav.label" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
const linksData = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Tasks',
    icon: 'code',
    link: '/ongoing'
  },
  {
    title: 'For Opening',
    icon: 'drafts',
    link: '/for-opening'
  },
  {
    title: 'Manage Options',
    icon: 'unfold_more',
    link: '/options'
  }
];

export default {
  name: 'MainLayout',
  components: {
    'notifications-list': () => import('../components/layout/NotificationsList.vue'),
    'download-task': () => import('../components/layout/DownloadTask.vue')
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    notifications() {
      return this.$store.state.notification.notifications
    },
    admin() {
      return this.$store.getters['auth/admin']
    },
    loggedIn() {
      return this.$store.getters['auth/loggedIn']
    },
    ongoing() {
      return this.$store.getters['assignment/ongoing']
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      rightDrawerOpen: false,
      hover: null
    }
  },
  methods: {
    confirmLogout() {
      this.$q.dialog({
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        cancel: true
      })
      .onOk(() => this.logout())
    },
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>

<style lang="scss">
  @media screen and (min-width: 768px) {
    .q-footer {
      display: none;
    }
  }
  
  .q-drawer {
    .q-router-link--exact-active {
      color: white !important;
    }
  }
</style>