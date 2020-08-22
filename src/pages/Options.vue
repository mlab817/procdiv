<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

		<enduser-table></enduser-table>

		<document-table class="q-mt-md"></document-table>

	</q-page>
</template>

<script>
	export default {
		components: {
			'enduser-table': () => import('../components/options/EnduserTable.vue'),
			'document-table': () => import('../components/options/DocumentTable.vue'),
		},
		name: 'PageOptions'
	}
</script>