<template>
	<q-page padding>
		<q-toolbar>
      		<q-toolbar-title>Overdue</q-toolbar-title>
    	</q-toolbar>

		<q-table :data="overdueTasks" :columns="columns" wrap-cells>
			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn icon="notifications" flat round dense color="grey" @click="remindTask(props.row)" :disabled="props.row.reminded">
						<q-tooltip>Remind!</q-tooltip>
					</q-btn>
				</q-td>
			</template>
		</q-table>
	</q-page>
</template>

<script>
	import { parseDate } from 'src/functions'
	import { date } from 'quasar'
	export default {
		name: 'PageOverdue',
		computed: {
			overdue() {
				return this.$store.getters['task/overdue']
			},
			overdueTasks() {
				const overdue = this.overdue
				return Object.keys(overdue).map(key => {
					return {
						...overdue[key],
						id: key
					}
				}).filter(x => x.status !== 'deleted')
			}
		},
		data() {
			return {
				columns: [
					{
						name: 'dateAssigned',
						label: 'Date Assigned',
						field: row => date.formatDate(parseDate(row.dateAssigned),'MMM D, YYYY hh:mm A'),
						sortable: true,
						align: 'center'
					},
					{
						name: 'document',
						label: 'Document',
						field: 'document',
						sortable: true,
						align: 'center'
					},
					{
						name: 'particulars',
						label: 'Particulars',
						field: 'particulars',
						sortable: true,
						align: 'center'
					},
					{
						name: 'enduser',
						label: 'Enduser',
						field: 'enduser',
						sortable: true,
						align: 'center'
					},
					{
						name: 'referenceNo',
						label: 'Reference No.',
						field: 'referenceNo',
						sortable: true,
						align: 'center'
					},
					{
						name: 'actionTaken',
						label: 'Action Taken',
						field: 'actionTaken',
						sortable: true,
						align: 'center'
					},
					{
						name: 'assignedTo',
						label: 'Assigned To',
						field: row => row.assignedTo.label,
						sortable: true,
						align: 'center'
					},
					{
						name: 'rfqDeadline',
						label: 'RFQ Deadline',
						field: row => (row.rfqDeadline ? date.formatDate(parseDate(row.rfqDeadline),'MMM D, YYYY hh:mm A') : ''),
						sortable: true,
						align: 'center'
					},
					{
						name: 'dateDue',
						label: 'Due Date/Time',
						field: row => (row.dateDue ?  date.formatDate(parseDate(row.dateDue),'MMM D, YYYY hh:mm A') : ''),
						sortable: true,
						align: 'center'
					},
					{
						name: 'remarks',
						label: 'Remarks',
						field: 'remarks',
						sortable: true,
						align: 'center'
					},
					{
						name: 'actions',
						label: 'Actions',
						align: 'center'
					}
				]
			}
		},
		methods: {
			remindTask(row) {
				this.$q.dialog({
					title: 'Remind User',
					message: 'Send a reminder to the assigned user.',
					cancel: true
				})
				.onOk(() => this.$store.dispatch('task/remindTask', row))
			}
		}
	}
</script>