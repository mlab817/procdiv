<template>
	<q-input outlined placeholder="Search assignments..." dense v-model="searchField" debounce="300" clearable>
    <template v-slot:append>
      <q-icon name="search"/>
    </template>
  </q-input>
</template>

<script>
	export default {
		name: 'Search',
		computed: {
			searchField: {
	      get() {
	        return this.$store.state.assignment.search
	      },
	      set(val) {
	        this.$store.dispatch('assignment/setSearch', val)
	      }
	    },
		}
	}
</script>