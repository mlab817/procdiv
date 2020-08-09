<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    assignments() {
      return this.$store.state.assignment.assignments
    }
  },
  mounted() {
  	this.$store.dispatch('auth/handleAuthStateChanged')
  }
}
</script>
