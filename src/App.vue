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
  	this.$store.dispatch('assignment/fbReadData')
  	this.$store.dispatch('document/fbReadData')
    this.$store.dispatch('deleted/fbReadData')
  	this.$store.dispatch('staff/fbReadData')
  	this.$store.dispatch('enduser/fbReadData')

    setTimeout(() => {
      this.$http.post('http://localhost:5000',this.assignments,{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => console.log(res.data))
    }, 5000)

    
  }
}
</script>
