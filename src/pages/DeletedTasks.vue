<template>
	<q-page padding>
		<q-table title="Trash" :data="tasks" :columns="columns" :filter="filter" wrap-cells :grid="$q.screen.lt.sm" separator="cell">
			<template v-slot:top-right>
				<q-input placeholder="Search" borderless v-model="filter">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>

			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn icon="restore" flat round color="positive" @click="restoreTask(props.row.id)"/>
				</q-td>
			</template>
		</q-table>
	</q-page>
</template>

<script>
	import { date } from 'quasar'
	import { parseDate } from 'src/functions'

	export default {
		name: 'DeletedTasks',
		computed: {
			tasks() {
				return this.$store.getters['task/deleted']
			}
		},
		data() {
			return {
				filter: '',
				columns: [
					{
						name: 'dateAssigned',
						label: 'Date Assigned',
						field: row => date.formatDate(parseDate(row.dateAssigned),'MMM D, YYYY'),
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
						field: row => (row.rfqDeadline ? date.formatDate(parseDate(row.rfqDeadline),'MMM D, YYYY') : ''),
						sortable: true,
						align: 'center'
					},
					{
						name: 'dateDue',
						label: 'Due Date/Time',
						field: row => (row.dateDue ?  date.formatDate(parseDate(row.dateDue),'MMM D, YYYY') : ''),
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
			restoreTask(id) {
				this.$q.dialog({
					title: 'Restore Task',
					message: 'Are you sure you want to restore task?',
					cancel: true
				})
				.onOk(() => this.$store.dispatch('task/restoreTask',id))
			}
		}
	}
</script>