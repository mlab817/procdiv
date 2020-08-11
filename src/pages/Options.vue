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
		name: 'PageOptions',
		computed: {
			staff() {
				const staff = this.$store.state.staff.staff
				let arrayStaff = []

				Object.keys(staff).forEach(key => {
					arrayStaff.push({
						id: key,
						name: staff[key].name,
						fullName: staff[key].fullName,
						email: staff[key].email
					})
				})

				return arrayStaff
			}
		}
	}
</script>