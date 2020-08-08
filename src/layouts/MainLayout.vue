<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
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
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
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
