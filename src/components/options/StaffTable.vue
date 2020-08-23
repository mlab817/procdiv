<template>
	<div>
		<div class="row justify-end q-mb-md">
			<q-btn color="primary" label="Add Staff" @click="addStaff"></q-btn>
		</div>
		<q-table title="Staff" :data="staff" :columns="columns" :pagination="pagination" :grid="$q.screen.lt.sm" :filter="filter">
			<template v-slot:top-right>
				<q-input borderless v-model="filter" placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn icon="edit" flat round dense color="primary" @click="editItem(props.row)"></q-btn>
					<q-btn icon="delete" flat round dense color="negative" @click="deleteItem(props.row)"></q-btn>
				</q-td>
			</template>

			<template v-slot:item="props">
				<div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
					<q-card>
						<q-card-section class="q-pa-none">
							<q-list dense>
	              <q-item v-for="col in props.cols.filter(col => col.name !== 'actions')" :key="col.name">
	                <q-item-section>
	                  <q-item-label caption>{{ col.label }}</q-item-label>
	                </q-item-section>
	                <q-item-section side>
	                  <q-item-label class="text-black">{{ col.value }}</q-item-label>
	                </q-item-section>
	              </q-item>
	            </q-list>
						</q-card-section>
						<q-card-actions align="right" v-if="admin">
							<q-btn icon="edit" flat round dense color="primary" @click="editItem(props.row)"></q-btn>
							<q-btn icon="delete" flat round dense color="negative" @click="deleteItem(props.row)"></q-btn>
						</q-card-actions>
					</q-card>
				</div>
			</template>
		</q-table>
	</div>
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
			},
			admin() {
				return this.$store.getters['auth/admin']
			}
		},
		data() {
			return {
				filter: '',
				columns: [
					{
						name: 'id',
						label: 'ID',
						field: 'id',
						align: 'left',
						sortable: true
					},
					{
						name: 'name',
						label: 'Name',
						field: 'name',
						align: 'center',
						sortable: true
					},
					{
						name: 'actions',
						label: 'Actions',
						align: 'center'
					}
				],
				pagination: {
					rowsPerPage: 0
				}
			}
		},
		methods: {
			addStaff() {
				this.$q.dialog({
					title: 'Add Staff',
					message: 'Enter name.',
					cancel: true,
					persistent: true,
					prompt: {
						model: '',
						type: 'text',
						isValid: val => !!val
					}
				}).onOk(data => this.$store.dispatch('staff/add', data))
			},
			deleteItem(staff) {
				this.$q.dialog({
					title: 'Delete Staff',
					message: `Are you sure you want to delete <strong>${staff.name}?</strong> Type <strong>Yes</strong> to confirm.`,
					cancel: true,
					persistent: true,
					html: true,
					prompt: {
						type: 'text',
						model: '',
						isValid: val => (val.toLowerCase() === 'yes')
					}
				}).onOk(() => this.$store.dispatch('staff/deleteStaff', staff.id))
			},
			editItem(row) {
				const name = row.name
				const id = row.id

				this.$q.dialog({
					title: 'Edit Staff',
					persisten: true,
					cancel: true,
					prompt: {
						model: name,
						type: 'text',
						isValid: val => !!val
					}
				}).onOk(data => {
					console.log('>>>>> ', data)
					const payload = {
						id: id, 
						updates: data
					}
					this.$store.dispatch('staff/update', payload)
				})
			},
			handleLink(payload) {
				this.$store.dispatch('staff/linkUser', payload)
			}
		}
	}
</script>