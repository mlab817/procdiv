<template>
	<q-card style="width: 400px;">
		<q-card-section class="row q-pa-sm">
			<div class="text-h6 row justify-between">
				Add/Edit Task
			</div>
			<q-space/>
			<q-btn icon="close" flat round dense v-close-popup />
		</q-card-section>
		<q-card-section>
			<q-form ref="myForm" greedy class="q-gutter-sm">
	      <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
	        <q-select 
	        	v-model="taskToSubmit.document" 
	        	:options="documents" 
	        	outlined 
	        	label="Document" 
	        	stack-label class="col" 
	        	emit-value 
	        	map-options 
	        	:rules="required" 
	        	hide-bottom-space 
	        	:dense="dense" 
	        	lazy-rules />
	        <div>
	          <q-btn flat round icon="edit" @click="addDocument" color="primary"></q-btn>
	        </div>
	      </div>

	      <q-input 
	      	v-model="taskToSubmit.particulars" 
	      	outlined 
	      	label="Particulars" 
	      	stack-label 
	      	:dense="dense" />

	      <q-input v-model="taskToSubmit.rfqDeadline" outlined label="RFQ Deadline" stack-label clearable :dense="dense">
	        <template v-slot:prepend>
	          <q-icon name="event" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-date v-model="taskToSubmit.rfqDeadline" mask="YYYY-MM-DD hh:mm A" />
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	        <template v-slot:append>
	          <q-icon name="access_time" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-time v-model="taskToSubmit.rfqDeadline" mask="YYYY-MM-DD hh:mm A" format12h />
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	      </q-input>

	      <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
	        <q-select 
	        	v-model="taskToSubmit.enduser" 
	        	use-input 
	        	@filter="filterEndusers" 
	        	:options="enduserOptions" 
	        	outlined 
	        	label="Enduser" 
	        	stack-label 
	        	class="col" 
	        	emit-value 
	        	map-options 
	        	:dense="dense"></q-select>
	        <div>
	          <q-btn flat round icon="edit" @click="addEnduserDialog = true" color="primary"></q-btn>
	        </div>
	      </div>

	      <q-input 
	      	v-model="taskToSubmit.referenceNo" 
	      	outlined 
	      	label="Reference No"
	      	stack-label 
	      	:dense="dense" />

	      <q-input 
	      	v-model="taskToSubmit.actionTaken" 
	      	outlined 
	      	label="Action Taken" 
	      	stack-label 
	      	:dense="dense" />

	      <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
	        <q-select 
	        	v-model="taskToSubmit.assignedTo" 
	        	:options="staff" 
	        	outlined 
	        	label="Assigned To" 
	        	stack-label 
	        	class="col" 
	        	:rules="required" 
	        	hide-bottom-space 
	        	:dense="dense" 
	        	lazy-rules></q-select>
	        <div>
	          <q-btn flat round icon="edit" @click="addStaff" color="primary"></q-btn>
	        </div>
	      </div>

	      <q-input 
	      	v-model="taskToSubmit.remarks" 
	      	outlined 
	      	label="Remarks" 
	      	stack-label
	      	:dense="dense"></q-input>

	      <q-input 
	      	v-model="taskToSubmit.dateDue" 
	      	outlined 
	      	label="Due Date/Time" 
	      	stack-label
	      	:dense="dense">
	        <template v-slot:prepend>
	          <q-icon name="event" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-date v-model="taskToSubmit.dateDue" mask="YYYY-MM-DD hh:mm A" />
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	        <template v-slot:append>
	          <q-icon name="access_time" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-time v-model="taskToSubmit.dateDue" mask="YYYY-MM-DD hh:mm A" format12h />
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	      </q-input>
	    </q-form>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn 
				flat 
				label="Delete" 
				color="negative" 
				v-if="!!taskToSubmit.id" 
				@click="deleteTask"></q-btn>
			<q-space />
			<q-btn 
				flat 
				label="Cancel" 
				v-close-popup />
			<q-btn 
				flat 
				label="Ok" 
				color="primary" 
				@click="submitForm" />
		</q-card-actions>
	</q-card>
</template>

<script>
	export default {
		name: 'AddEditTask',
		props: ['task'],
		computed: {
			documents() {
				return this.$store.getters['document/options']
			},
			staff() {
				return this.$store.getters['staff/options']
			},
			endusers() {
				return this.$store.getters['enduser/options']
			},
			users() {
				return this.$store.getters['user/options']
			},
			dense() {
				return this.$q.screen.lt.sm
			}
		},
		data() {
			return {
				taskToSubmit: {},
				required: [val => !!val || '* Required'],
				addEnduserDialog: false,
				enduserOptions: []
			}
		},
		methods: {
			submitForm() {
				this.$refs.myForm.validate().then(success => {
					if (success) {
						const taskToSubmit = this.taskToSubmit
						if (!!taskToSubmit.id) {
							const payload = {
								id: this.taskToSubmit.id,
								updates: this.taskToSubmit
							}
							this.$store.dispatch('task/updateTask', payload)
						} else {
							this.$store.dispatch('task/addTask', this.taskToSubmit)
						}
					} else {
						alert('fail')
					}
					this.$emit('close')
				})
			},
			addDocument() {

			},
			addStaff() {

			},
			filterEndusers(val, update, abort) {
				update(() => {
					if (val !== '') {
						const needle = val.toLowerCase()
						this.enduserOptions = this.endusers.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
					} else {
						this.enduserOptions = this.endusers
					}
				})
			},
			deleteTask() {
				const id = this.taskToSubmit.id
				this.$q.dialog({
					title: 'Confirm Delete',
					message: 'Are you sure you want to delete this task?',
					cancel: true,
					persistent: true,
					prompt: {
						model: '',
						isValid: val => (!!val && val.toLowerCase() === 'yes')
					}
				})
				.onOk(() => this.$store.dispatch('task/deleteTask', id))
			}
		},
		mounted() {
			this.taskToSubmit = Object.assign({}, this.task)
		}
	}
</script>