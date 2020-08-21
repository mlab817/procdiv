<template>
	<q-table :data="staff" :columns="columns">
		<template v-slot:body-cell-actions="props">
			<q-td :props="props">
				<q-btn :icon="props.row.linked ? 'link_off' : 'link' " flat round dense :color="props.row.linked ? 'negative' : 'primary'" @click="linkUser(props.row)">
					<q-tooltip>{{ props.row.linked ? 'Unlink' : 'Link' }}</q-tooltip>
				</q-btn>
			</q-td>
		</template>
		<template v-slot:body-cell-avatar="props">
			<q-td :props="props">
				<q-avatar>
					<q-img :src="props.row.photoURL ? props.row.photoURL : ''" />
				</q-avatar>
			</q-td>
		</template>
	</q-table>
</template>

<script>
	export default {
		name: 'StaffTable',
		computed: {
			staff() {
				const staff = this.$store.state.staff.staff
				let array = []
				Object.keys(staff).forEach(key => {
					const stf = staff[key]
					array.push({
						id: key,
						...stf
					})
				})

				return array
			},
			users() {
				const users = this.$store.state.user.users
				let array = []

				Object.keys(users).forEach(key => {
					const user = users[key]

					array.push({
						id: key,
						...user
					})
				})

				return array
			}
		},
		data() {
			return {
				columns: [
					{
						name: 'uid',
						label: 'UID',
						field: 'uid'
					},
					{
						name: 'displayName',
						label: 'Display Name',
						field: 'displayName'
					},
					{
						name: 'name',
						label: 'Name',
						field: 'name'
					},
					{
						name: 'avatar',
						label: 'Avatar',
						field: 'photoURL'
					},
					{
						name: 'email',
						label: 'Email',
						field: 'email'
					},
					{
						name: 'actions',
						label: 'Actions'
					}
				]
			}
		},
		methods: {
			linkUser(staff) {
				console.log(staff)
				const users = this.users
				const mappedUser = users.map(x => {
					return {
						value: x.id,
						label: `${x.displayName} (${x.email})`
					}
				})

				this.$q.dialog({
					title: 'Link User',
					message: 'Link the staff to a user account',
					cancel: true,
					options: {
						model: '',
						type: 'radio',
						items: mappedUser,
						isValid: val => !!val
					}
				})
				.onOk(data => {
					// data here is key so i can get user from the array
					const user = this.users.filter(user => user.id === data)
					if (user.length) {
						const { displayName, email, photoURL, role, uid } = user[0]
						const payload = {
							id: staff.id,
							user: {
								displayName: displayName, 
								email: email, 
								photoURL: photoURL, 
								role: role, 
								uid: uid
							}
						}
						this.handleLink(payload)
					} else {
						console.error('No user')
					}
				})
			},
			handleLink(payload) {
				this.$store.dispatch('staff/linkUser', payload)
			}
		}
	}
</script>