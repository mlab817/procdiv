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

        <q-btn flat round icon="notifications" color="grey-9" @click="rightDrawerOpen = !rightDrawerOpen">
          <q-badge color="red" floating>
            {{Object.keys(notifications).length}}
          </q-badge>
          <q-tooltip>Notifications</q-tooltip>
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

    <q-drawer v-model="rightDrawerOpen" side="right" bordered overlay>
      <div class="q-pa-sm">
        <div class="text-h6">Notifications</div>
      </div>
      <q-list>
        <template v-if="Object.keys(notifications).length">
          <q-item v-for="(notification, key) in notifications" :key="key" clickable @mouseover="hover = key" @mouseleave="hover = null">
            <q-item-section avatar>
              <q-avatar class="bg-primary text-white">A</q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{notification.message}}
              </q-item-label>
              <q-item-label caption :class="notification.read ? 'text-grey-5' : 'text-primary'">
                {{timeAgo(notification.createdAt)}}
              </q-item-label>
            </q-item-section>
            <q-item-section top side v-if="!notification.read && hover == key">
              <q-btn icon="done" flat round dense @click="markAsRead(key)"></q-btn>
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else>
          <q-item-section avatar>
            <q-avatar class="bg-negative text-white">?</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>No new notifications.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
import { timeAgo } from 'src/functions'

const linksData = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Add PR/PRAS',
    icon: 'article',
    link: '/pr-pras'
  },
  {
    title: 'Ongoing',
    icon: 'code',
    link: '/ongoing'
  },
  {
    title: 'For Opening',
    icon: 'code',
    link: '/for-opening'
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
    },
    notifications() {
      return this.$store.state.notification.notifications
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
    },
    markAsRead(key) {
      this.$store.dispatch('notification/markAsRead', key)
    },
    timeAgo
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