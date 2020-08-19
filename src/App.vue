<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { firebaseConfig } from './config'

export default {
  name: 'App',
  computed: {
    assignments() {
      return this.$store.state.assignment.assignments
    }
  },
  mounted() {
  	this.$store.dispatch('auth/handleAuthStateChanged')
    this.$store.dispatch('notification/fbReadData')
  }
}
</script>
