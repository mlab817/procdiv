<template>
	<q-page padding>
  	<q-card style="width: 400px; max-width: 80wh;">
  		<q-card-section class="row justify-between text-h6">
  			Customize Download
  		</q-card-section>
  		<q-card-section>
  			<q-form class="q-gutter-y-md">
	  			
	  			<q-input filled v-model="dateAssignedText" class="col" stack-label label="Date Assigned" hint="Leave blank to select all dates">
	  				<template v-slot:append>
			        <q-icon name="event" class="cursor-pointer">
			          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
			            <q-date v-model="dateAssigned" multiple>
			              <div class="row items-center justify-end">
			                <q-btn v-close-popup label="Close" color="primary" flat />
			              </div>
			            </q-date>
			          </q-popup-proxy>
			        </q-icon>
			      </template>
	        </q-input>

	        <q-select 
	        	filled 
	        	v-model="document" 
	        	:options="documents" 
	        	label="Document" 
	        	stack-label 
	        	multiple 
	        	hint="Leave blank to select all documents"></q-select>

	        <q-select 
	        	filled 
	        	v-model="assignedStaff" 
	        	:options="staff" 
	        	label="Assigned Staff" 
	        	stack-label 
	        	multiple 
	        	hint="Leave blank to select all staff"></q-select>

	        <q-input filled v-model="dateDueText" class="col" stack-label label="Date Due" hint="Leave blank to select all dates">
	  				<template v-slot:append>
			        <q-icon name="event" class="cursor-pointer">
			          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
			            <q-date v-model="datesDue" multiple>
			              <div class="row items-center justify-end">
			                <q-btn v-close-popup label="Close" color="primary" flat />
			              </div>
			            </q-date>
			          </q-popup-proxy>
			        </q-icon>
			      </template>
	        </q-input>

	        <q-input filled v-model="dateCompletedText" class="col" stack-label label="Date Completed" hint="Leave blank to select all dates">
	  				<template v-slot:append>
			        <q-icon name="event" class="cursor-pointer">
			          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
			            <q-date v-model="datesCompleted" multiple>
			              <div class="row items-center justify-end">
			                <q-btn v-close-popup label="Close" color="primary" flat />
			              </div>
			            </q-date>
			          </q-popup-proxy>
			        </q-icon>
			      </template>
	        </q-input>

	        <q-select 
	        	filled 
	        	v-model="status" 
	        	:options="statuses" 
	        	label="Status" 
	        	stack-label 
	        	multiple 
	        	hint="Leave blank to select all status"></q-select>

        </q-form>
  		</q-card-section>
  		<q-card-actions align="right">
  			<q-btn color="primary" label="Download" unelevated @click="downloadTasks"></q-btn>
  		</q-card-actions>
  	</q-card>
	</q-page>
</template>

<script>
	export default {
		name: 'DownloadTask',
		computed: {
			dateAssignedText: {
				get() {
					const datesAssigned = this.datesAssigned

					if (!datesAssigned.length) {
						return null
					} else if (datesAssigned.length > 3) {
						return datesAssigned.length + ' days selected'
					} else {
						return datesAssigned.join(', ')
					}
				},
				set(val) {
					this.datesAssigned = val
				}
			},
			dateDueText: {
				get() {
					const datesDue = this.datesDue

					if (!datesDue.length) {
						return null
					} else if (datesDue.length > 3) {
						return datesDue.length + ' days selected'
					} else {
						return datesDue.join(', ')
					}
				},
				set(val) {
					this.datesDue = val
				}
			},
			dateCompletedText: {
				get() {
					const datesCompleted = this.datesCompleted

					if (!datesCompleted.length) {
						return null
					} else if (datesCompleted.length > 3) {
						return datesCompleted.length + ' days selected'
					} else {
						return datesCompleted.join(', ')
					}
				},
				set(val) {
					this.datesCompleted = val
				}
			},
			documents() {
				return this.$store.getters['document/options']
			},
			staff() {
				return this.$store.getters['staff/options']
			}
		},
		data() {
			return {
				datesAssigned: [],
				document: [],
				assignedStaff: [],
				datesDue: [],
				status: [],
				datesCompleted: [],
				statuses: ['Ongoing','Completed','Deleted']
			}
		}
	}
</script>