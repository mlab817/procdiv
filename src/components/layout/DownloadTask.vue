<template>
	<q-item class="text-center">
	  <q-btn outline icon="archive" label="Download" to="/download-tasks" />
	</q-item>
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
				dateAssigned: {
					from: '',
					to: ''
				},
				downloadTasksDialog: false,
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
						field: row => row.referenceNo
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