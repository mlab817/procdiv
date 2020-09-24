<template>
	<q-page>
		<pre>{{overdue}}</pre>
	</q-page>
</template>

<script>
	export default {
		name: 'PageOverdue',
		computed: {
			overdue() {
				return this.$store.getters['task/overdue']
			}
		}
	}
</script>