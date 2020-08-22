<template>
	<q-page padding>
		<user-table />
	</q-page>
</template>

<script>
	export default {
		components: {
			'user-table': () => import('../components/options/UserTable.vue')
		},
		name: 'ManageUsers'
	}
</script>