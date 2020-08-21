<template>
	<q-page padding>
		<div class="row justify-end q-mb-md">
			<q-btn icon="archive" class="q-ml-sm" label="Download" color="green" />
			<q-btn icon="add_task" class="q-ml-sm" label="Add Task" color="primary" @click="addTask" />
		</div>
		<q-table title="Ongoing" :data="tasks" :columns="columns" :filter="filter" wrap-cells :grid="$q.screen.lt.sm">
			<template v-slot:top-right>
				<q-input borderless v-model="filter" placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>

			<template v-slot:body-cell-overdue="props">
				<q-td :props="props">
					<q-icon name="priority_high" color="red" v-if="overdue(props.row.dateDue)" />
				</q-td>
			</template>

			<template v-slot:body-cell-dateDue="props">
				<q-td :props="props">
					{{ props.row.dateDue }}
				</q-td>
			</template>

			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<div>
						<q-btn icon="check" flat round dense color="positive" @click="completeTask(props.row)">
							<q-tooltip>Mark as completed</q-tooltip>
						</q-btn>
						<q-btn icon="edit" flat round dense color="primary" @click="editTask(props.row)">
							<q-tooltip>Edit</q-tooltip>
						</q-btn>
						<q-btn icon="delete" flat round dense color="negative" @click="deleteTask(props.row)">
							<q-tooltip>Delete</q-tooltip>
						</q-btn>
						<q-btn icon="notifications" flat round dense color="grey" @click="remindTask(props.row)" :disabled="props.row.reminded">
							<q-tooltip>Remind!</q-tooltip>
						</q-btn>
					</div>
				</q-td>
			</template>

			<template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-negative q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            Well this is sad... {{ message }}
          </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>
		</q-table>

		<q-dialog v-model="addTaskDialog" persistent>
			<add-edit-task :task="task" @close="addTaskDialog = false"></add-edit-task>
		</q-dialog>
	</q-page>
</template>

<script>
	import { parseDate } from 'src/functions'
	import { date } from 'quasar'

	export default {
		components: {
			'add-edit-task': () => import('../components/AddEditTask.vue')
		},
		name: 'PageTasks',
		computed: {
			tasks() {
				return this.$store.getters['task/ongoing']
			}
		},
		data() {
			return {
				addTaskDialog: false,
				task: {
					id: null,
					document: '',
					particulars: '',
					rfqDeadline: '',
					enduser: '',
					referenceNo: '',
					actionTaken: '',
					assignedTo: '',
					remarks: '',
					dateDue: ''
				},
				filter: '',
				columns: [
					{
						name: 'overdue',
						label: ''
					},
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
			addTask() {
				this.task = {
					id: null,
					document: '',
					particulars: '',
					rfqDeadline: '',
					enduser: '',
					referenceNo: '',
					actionTaken: '',
					assignedTo: '',
					remarks: '',
					dateDue: ''
				}

				this.addTaskDialog = true
			},
			completeTask(row) {
				// mark as completed
				this.$q.dialog({
					title: 'Complete Task',
					message: 'Mark task as completed?',
					cancel: true,
					persistent: true
				})
				.onOk(() => this.$store.dispatch('task/completeTask', row.id))
			},
			editTask(row) {
				this.task = row
				this.addTaskDialog = true
			},
			deleteTask(row) {
				this.$q.dialog({
					title: 'Delete Task',
					message: 'Are you sure you want to delete this task? Type in <strong>Yes</strong> to confirm.',
					html: true,
					prompt: {
						model: '',
						isValid: val => (!!val && val.toLowerCase() === 'yes')
					},
					cancel: true
				})
				.onOk(() => this.$store.dispatch('task/deleteTask', row.id))
			},
			notifyUser(row) {
				// send notification to user by creating a notification
			},
			overdue(dateDue) {
				const now = new Date()
				const due = new Date(dateDue)

				if (due < now) {
					return true
				} else {
					return false
				}
			},
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