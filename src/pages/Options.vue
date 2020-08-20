<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

		<enduser-table></enduser-table>

		<document-table class="q-mt-md"></document-table>

		<user-table class="q-mt-md"></user-table>

	</q-page>
</template>

<script>
	export default {
		components: {
			'enduser-table': () => import('../components/options/EnduserTable.vue'),
			'user-table': () => import('../components/options/UserTable.vue'),
			'document-table': () => import('../components/options/DocumentTable.vue')
		},
		name: 'PageOptions'
	}
</script>