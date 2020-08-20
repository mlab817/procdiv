<template>
	<q-page padding>
		<q-table :data="pras" :columns="columns" title="PR/PRAS">
			<template v-slot:top-right>
				<q-btn color="primary" label="Add" unelevated @click="addItem"></q-btn>
			</template>
			<template v-slot:body-cell-actions="props">
	    	<q-td :props="props">
	    		<div>
		        <q-btn 
		        	color="primary" 
		        	round 
		        	icon="edit" 
		        	@click.stop="editItem(props.row)" 
		        	dense 
		        	flat />
		        <q-btn 
		        	color="negative" 
		        	round 
		        	icon="delete" 
		        	@click.stop="deleteItem(props.row)" 
		        	dense 
		        	flat />
			    </div>
	    	</q-td>
	    </template>
		</q-table>

		<q-dialog v-model="add">
			<q-card style="min-width: 300px;">
				<q-card-section class="row justify-between">
					<div class="text-h6">Add PR/PRAS</div>
					<q-space/>
					<q-btn 
						flat 
						round 
						dense 
						icon="close" 
						v-close-popup></q-btn>
				</q-card-section>
				<q-card-section>
					<q-form ref="addForm" greedy>
						<my-autocomplete 
							v-model="newDocument.referenceNo" 
							:options="simplyPras" />
						<q-select 
							v-model="newDocument.type" 
							:options="types" 
							label="Type" 
							stack-label
							:rules="required"
							hide-bottom-space></q-select>
						<q-select 
							v-model="newDocument.enduser" 
							label="Enduser" 
							:options="filterEndusers" 
							map-options 
							emit-value
							use-input 
							@filter="filterFn" 
							stack-label
							:rules="required"
							hide-bottom-space></q-select>
						<q-input 
							v-model="newDocument.referenceNo" 
							label="Reference No." 
							stack-label
							:rules="required"
							hide-bottom-space></q-input>
						<q-input 
							v-model="newDocument.subject" 
							label="Subject" 
							stack-label
							:rules="required"
							hide-bottom-space></q-input>
					</q-form>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn 
						flat 
						label="Cancel" 
						v-close-popup></q-btn>
					<q-btn 
						flat 
						color="primary" 
						label="Submit" 
						@click="submit"></q-btn>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script>
	export default {
		components: {
			'my-autocomplete': () => import('../components/Autocomplete.vue')
		},
		name: 'PrasPage',
		computed: {
			endusers() {
				return this.$store.getters['enduser/options']
			},
			pras() {
				return this.$store.getters['pras/pras']
			},
			simplyPras() {
				const pras = this.pras
				let acc = []

				acc = pras.map(pra => {
					return pra.referenceNo
				})

				return acc
			}
		},
		data() {
			return {
				add: false,
				types: ['PRAS','PR'],
				newDocument: {
					type: 'PRAS',
					referenceNo: '20-',
					enduser: '',
					subject: ''
				},
				filterEndusers: [],
				columns: [
					{
						name: 'type',
						label: 'Type',
						field: 'type',
						align: 'center'
					},
					{
						name: 'referenceNo',
						label: 'Reference Number',
						field: 'referenceNo',
						align: 'center'
					},
					{
						name: 'enduser',
						label: 'Enduser',
						field: 'enduser',
						align: 'center'
					},
					{
						name: 'subject',
						label: 'Subject',
						field: 'subject',
						align: 'center'
					},
					{
						name: 'actions',
						label: 'Actions'
					}
				],
				required: [ val => !!val || '* Required']
			}
		},
		methods: {
			submit() {
				// validate form first
				this
					.$refs
					.addForm
					.validate()
					.then(success => {
					if (success) {
						const { id, type, referenceNo, enduser,  subject } = this.newDocument

						console.log(id, type, referenceNo, enduser, subject)

						if (id === undefined) {
							// create new record
							this.$store.dispatch('pras/add', {
								type: type,
								referenceNo: referenceNo,
								enduser: enduser,
								subject: subject
							})
						} else {
							this.$store.dispatch('pras/update', {
								id: id,
								type: type,
								referenceNo: referenceNo,
								enduser: enduser,
								subject: subject
							})
						}
						this.add = false
					} else {
						alert('check form')
					}
				})
			},
			filterFn(val, update, abort) {
				update(() => {
					if (val === '') {
						this.filterEndusers = this.endusers
					}
					else {
						const needle = val.toLowerCase()
						this.filterEndusers = this.endusers.filter(
							v => v.label.toLowerCase().indexOf(needle) > -1
						)
					}
					console.log(this.filterEndusers)
				})
			},
			editItem(item) {
				this.newDocument = Object.assign({}, item)

				console.log(this.newDocument)
				
				this.add = true
			},
			deleteItem(item) {
				this.$q.dialog({
					title: 'Delete',
					message: 'Are you sure you want to delete this item?',
					cancel: true
				})
				.onOk(() => {
					// delete item.id
					this.$store.dispatch('pras/delete', item.id)
				})
			},
			addItem() {
				this.newDocument = {
					type: 'PRAS',
					referenceNo: '20-',
					enduser: '',
					subject: ''
				}
				this.add = true
			}
		},
		created() {
			this.$store.dispatch('pras/fbReadData')
		}
	}
</script>