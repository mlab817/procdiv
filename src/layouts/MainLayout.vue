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

        <q-btn flat round icon="notifications" color="grey-9">
          <q-badge color="red" floating transparent>
            4
          </q-badge>
        </q-btn>
        <q-btn flat stretch icon="person" label="Login" to="/auth" v-if="!loggedIn"></q-btn>
        <q-btn flat stretch icon-right="exit_to_app" label="Logout" v-else @click="confirmLogout">
          
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

        <q-list dark>
          <q-item-label header>
            Navigation
          </q-item-label>
          <template
            v-for="link in essentialLinks"
          >
            <q-item
              clickable
              tag="a"
              :to="link.link"
              exact
              :key="link.title"
              class="text-grey-4"
            >
              <q-item-section
                v-if="link.icon"
                avatar
              >
                <q-icon :name="link.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
                <q-item-label caption>
                  {{ link.caption }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
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
    title: 'Manage Options',
    icon: 'dashboard',
    link: '/options'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  },
];

export default {
  name: 'MainLayout',
  components: {},
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn
    },
    user() {
      return this.$store.state.auth.user
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