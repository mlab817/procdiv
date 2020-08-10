<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

		<div class="row q-mt-md">

			<div class="col-12">

				<q-table title="Endusers" :data="endusers" :filter="filterEnduser" :columns="columnsEndusers" row-key="id">
					<template v-slot:top-right>
				        <q-input borderless dense debounce="300" v-model="filterEnduser" placeholder="Search">
				          	<template v-slot:append>
				            	<q-icon name="search" />
				          	</template>
				        </q-input>
				        <q-btn color="primary" class="q-ml-md" label="Add row" @click="addEnduserDialog = true" />
				    </template>
				</q-table>

			</div>

		</div>

		<div class="row q-col-gutter-md q-mt-md">

			<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">

				<q-table title="Documents" :data="documents" :filter="filterDocuments" row-key="id">
					<template v-slot:top-right>
				        <q-input borderless dense debounce="300" v-model="filterDocument" placeholder="Search">
				          	<template v-slot:append>
				            	<q-icon name="search" />
				          	</template>
				        </q-input>
				    </template>
				</q-table>

			</div>

			<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">

				<q-table title="Staff" :data="staff" :filter="filterStaff" row-key="id">
					<template v-slot:top-right>
				        <q-input borderless dense debounce="300" v-model="filterStaff" placeholder="Search">
				          	<template v-slot:append>
				            	<q-icon name="search" />
				          	</template>
				        </q-input>
				    </template>
				</q-table>

			</div>

		</div>

		<q-dialog v-model="addEnduserDialog" persistent>
	      <q-card style="min-width: 400px;">
	        <q-card-section class="row justify-between">
	          <div class="text-h6">Add Enduser</div>
	          <q-space/>
	          <q-btn flat round dense v-close-popup icon="close"></q-btn>
	        </q-card-section>
	        <q-card-section>
	          <q-form class="q-gutter-md">
	            <q-input v-model="newEnduser.label" label="Label" stack-label outlined />
	            <q-input v-model="newEnduser.value" label="Value" stack-label outlined />
	          </q-form>
	        </q-card-section>
	        <q-card-actions align="right">
	          <q-btn flat label="Cancel" color="primary" v-close-popup></q-btn>
	          <q-btn flat label="OK" color="primary" :disabled="!newEnduser.label || !newEnduser.value" @click="addEnduser"></q-btn>
	        </q-card-actions>
	      </q-card>
	    </q-dialog>
	</q-page>
</template>

<script>
	export default {
		name: 'PageOptions',
		computed: {
			endusers() {
				const endusers = this.$store.state.enduser.endusers
				let arrayEndusers = []

				Object.keys(endusers).forEach(key => {
					arrayEndusers.push({
						id: key,
						label: endusers[key].label,
						value: endusers[key].value
					})
				})

				return arrayEndusers
			},
			documents() {
				const documents = this.$store.state.document.documents
				let arrayDocuments = []

				Object.keys(documents).forEach(key => {
					arrayDocuments.push({
						id: key,
						name: documents[key].name
					})
				})

				return arrayDocuments
			},
			staff() {
				const staffs = this.$store.state.staff.staff
				let arrayStaff = []

				Object.keys(staffs).forEach(key => {
					arrayStaff.push({
						id: key,
						name: staffs[key].name
					})
				})

				return arrayStaff
			}
		},
		data() {
			return {
				addEnduserDialog: false,
				filterEnduser: '',
				newEnduser: {
					label: '',
					value: '',
				},
				columnsEndusers: [
					{
						name: 'id',
						label: 'ID',
						align: 'left',
						field: row => row.id,
						sortable: true
					},
					{
						name: 'label',
						label: 'Label',
						align: 'left',
						field: row => row.label,
						sortable: true
					},
					{
						name: 'value',
						label: 'Value',
						align: 'left',
						field: row => row.value,
						sortable: true
					},
				]
			}
		},
		methods: {
			addEnduser() {

			}
		}
	}
</script>