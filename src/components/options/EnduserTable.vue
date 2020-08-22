<template>
	<div>
		<q-table title="Endusers" :data="endusers" :filter="filterEnduser" :columns="columnsEndusers" row-key="id" :grid="$q.screen.lt.sm">
			<template v-slot:top-right>
		        <q-input borderless dense debounce="300" v-model="filterEnduser" placeholder="Search">
		          	<template v-slot:append>
		            	<q-icon name="search" />
		          	</template>
		        </q-input>
		        <q-btn color="primary" class="q-ml-md" label="Add row" @click="addEnduser" />
		    </template>
		    <template v-slot:body-cell-actions="props">
		    	<q-td :props="props">
		    		<div>
				        <q-btn color="primary" round icon="edit" @click.stop="editEnduser(props.row)" dense flat />
				        <q-btn color="negative" round icon="delete" @click.stop="deleteEnduser(props.row)" dense flat />
				    </div>
		    	</q-td>
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
	          <q-btn flat label="OK" color="primary" :disabled="!newEnduser.label || !newEnduser.value" @click="handleEnduserSubmit"></q-btn>
	        </q-card-actions>
	      </q-card>
	    </q-dialog>
	</div>
</template>

<script>
export default {
	name: 'EnduserTable',
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
	},
	data() {
		return {
			addEnduserDialog: false,
			filterEnduser: '',
			newEnduser: {
				id: '',
				label: '',
				value: '',
			},
			columnsEndusers: [
				{
					name: 'id',
					label: 'ID',
					align: 'left',
					field: row => row.id,
					classes: 'col-2',
					sortable: true
				},
				{
					name: 'label',
					label: 'Label',
					align: 'left',
					classes: 'col-5',
					field: row => row.label,
					sortable: true
				},
				{
					name: 'value',
					label: 'Value',
					align: 'left',
					classes: 'col-5',
					field: row => row.value,
					sortable: true
				},
				{
					name: 'actions',
					label: 'Actions'
				}
			]
		}
	},
	methods: {
		addEnduser() {
			this.newEnduser = {
				id: null,
				label: '',
				value: ''
			}
			this.addEnduserDialog = true
		},
		editEnduser(enduser) {
			this.newEnduser = enduser

			this.addEnduserDialog = true
		},
		handleEnduserSubmit() {
			const enduser = this.newEnduser
			console.log(enduser)

			if (enduser.id) {
				// update
				this.$store.dispatch('enduser/update', enduser)
			} else {
				// add
				this.$store.dispatch('enduser/add', enduser)
			}
		},
		deleteEnduser(enduser) {
			this.$q.dialog({
				title: 'Confirm Delete',
				message: `Are you sure you want to delete ${enduser.label}?`,
				cancel: true,
				persistent: true
			})
			.onOk(() => this.$store.dispatch('enduser/delete', enduser.id))
		}
	}
}
</script>