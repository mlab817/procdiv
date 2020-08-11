<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

		<enduser-table></enduser-table>

	</q-page>
</template>

<script>
	export default {
		components: {
			'enduser-table': () => import('../components/EnduserTable.vue')
		},
		name: 'PageOptions'
	}
</script>