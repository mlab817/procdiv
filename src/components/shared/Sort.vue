<template>
	<div class="row">
		<q-select 
			class="sort"
			filled
			v-model="sortBy"
			:options="sortOptions"
			emit-value
			map-options
			dense />

		<q-btn 
			:icon="sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'" 
			class="q-ml-sm dir" 
			:label="sortDir === 'asc' ? 'ASC' : 'DESC'" 
			:color="sortDir === 'asc' ? 'primary' : 'negative'" 
			@click="toggleSortDir" />
	</div>	
</template>

<script>
	export default {
		name: 'Sort',
		computed: {
			sortBy: {
	    	get() {
	    		return this.$store.state.assignment.sortBy
	    	},
	    	set(val) {
	    		this.$store.dispatch('assignment/setSortBy', val)
	    	}
	    },

	    sortDir() {
	    	return this.$store.state.assignment.sortDir
	    }
		},
		data() {
			return {
				sortOptions: [
	      	{
	      		label: 'Date Assigned',
	      		value: 'dateAssigned'
	      	},
	      	{
	      		label: 'Document',
	      		value: 'document'
	      	},
	      	{
	      		label: 'Particulars',
	      		value: 'particulars'
	      	},
	      	{
	      		label: 'Enduser',
	      		value: 'enduser'
	      	},
	      	{
	      		label: 'Reference No.',
	      		value: 'referenceNo'
	      	},
	      	{
	      		label: 'Action Taken',
	      		value: 'actionTaken'
	      	},
	      	{
	      		label: 'Assigned Staff',
	      		value: 'assignedTo'
	      	},
	      	{
	      		label: 'Remarks',
	      		value: 'remarks'
	      	},
	      	{
	      		label: 'Due Date',
	      		value: 'dateDue'
	      	}
	      ]
			}
		},
		methods: {
	    toggleSortDir() {
	    	if (this.sortDir === 'asc') {
	    		this.$store.dispatch('assignment/setSortDir', 'desc')
	    	} else {
	    		this.$store.dispatch('assignment/setSortDir', 'asc')
	    	}
	    },
		}
	}
</script>

<style>
	.sort {
		width: 150px;
	}

	.dir {
		width: 105px;
	}
</style>