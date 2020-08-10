<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

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
			}
		},
		data() {
			return {
				addEnduserDialog: true,
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