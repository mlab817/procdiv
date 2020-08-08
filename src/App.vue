<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
  	this.$store.dispatch('auth/handleAuthStateChanged')
  	this.$store.dispatch('assignment/fbReadData')
  	this.$store.dispatch('document/fbReadData')
  	this.$store.dispatch('staff/fbReadData')
  	this.$store.dispatch('enduser/fbReadData')
  }
}
</script>
