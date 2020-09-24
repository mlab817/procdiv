<template>
	<q-page padding>
  	<q-card style="width: 400px; max-width: 80wh;">
  		<q-card-section class="row justify-between text-h6">
  			Customize Download
  			<q-item-label caption class="text-negative">
  				Customization is a work-in-progress. Meanwhile, the download button will download all tasks.
  			</q-item-label>
  		</q-card-section>
  		<q-card-section>
  			<q-form class="q-gutter-y-md">
	  			
	  			<q-input filled v-model="dateAssignedText" class="col" stack-label label="Date Assigned" hint="Leave blank to select all dates">
	  				<template v-slot:append>
			        <q-icon name="event" class="cursor-pointer">
			          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
			            <q-date v-model="datesAssigned" multiple>
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
  			<q-btn icon="archive" label="Download" @click="downloadTasks" color="primary" unelevated />
  		</q-card-actions>
  	</q-card>
	</q-page>
</template>

<script>
	import { exportFile } from 'quasar'

	function wrapCsvValue (val, formatFn) {
	  let formatted = formatFn !== void 0
	    ? formatFn(val)
	    : val

	  formatted = formatted === void 0 || formatted === null
	    ? ''
	    : String(formatted)

	  formatted = formatted.split('"').join('""')
	  /**
	   * Excel accepts \n and \r in strings, but some other CSV parsers do not
	   * Uncomment the next two lines to escape new lines
	   */
	  // .split('\n').join('\\n')
	  // .split('\r').join('\\r')

	  return `"${formatted}"`
	}

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
			},
			tasks() {
	      const tasks = this.$store.state.task.tasks
	      let arrayTask = []

	      Object.keys(tasks).forEach(key => {
	      	const task = tasks[key]

	      	arrayTask.push({
	      		...task,
	      		id: key
	      	})
	      })

	      return arrayTask
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
				statuses: ['Ongoing','Completed','Deleted'],
				columns: [
					{
						name: 'id',
						label: 'ID',
						field: 'id'
					},
					{
						name: 'dateAssigned',
						label: 'Date Assigned',
						field: row => row.dateAssigned
					},
					{
						name: 'assignedTo',
						label: 'Assigned To',
						field: row => row.assignedTo.label
					},
					{
						name: 'enduser',
						label: 'Enduser',
						field: 'enduser'
					},
					{
						name: 'document',
						label: 'Document',
						field: row => row.document
					},
					{
						name: 'referenceNo',
						label: 'Reference Number',
						field: 'referenceNo'
					},
					{
						name: 'actionTaken',
						label: 'Action Taken',
						field: 'actionTaken'
					},
					{
						name: 'dateDue',
						label: 'Due Date/Time',
						field: row => row.dateDue
					},
					{
						name: 'status',
						label: 'Status',
						field: 'status'
					},
					{
						name: 'dateCompleted',
						label: 'Date Completed',
						field: row => row.dateCompleted
					}
				]
			}
		},
		methods: {
			downloadTasks() {
	      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
	        this.tasks.map(row => this.columns.map(col => wrapCsvValue(
	          typeof col.field === 'function'
	            ? col.field(row)
	            : row[col.field === void 0 ? col.name : col.field],
	          col.format
	        )).join(','))
	      ).join('\r\n')

	      const status = exportFile(
	        'tasks.csv',
	        content,
	        'text/csv'
	      )

	      if (status !== true) {
	        this.$q.notify({
	          message: 'Browser denied file download...',
	          color: 'negative',
	          icon: 'warning'
	        })
	      }
	    }
		}
	}
</script>