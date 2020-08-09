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

        <q-btn flat stretch icon="person" label="Login" to="/auth" v-if="!loggedIn"></q-btn>
        <q-btn flat stretch icon-right="exit_to_app" label="Logout" v-else @click="confirmLogout"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      bordered
      content-class="bg-primary"
      v-if="loggedIn"
    >
      <q-list dark>
        <q-item-label header>
          Navigation
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
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
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Ongoing',
    icon: 'code',
    link: '/ongoing'
  },
  {
    title: 'Completed',
    icon: 'done_outline',
    link: '/completed'
  },
  {
    title: 'Deleted',
    icon: 'delete',
    link: '/deleted'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
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