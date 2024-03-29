<template>
	<q-page padding>
		<div class="row justify-end q-mb-md">
			<q-btn icon="add_task" class="q-ml-sm" label="Add Task" color="primary" @click="addTask" v-if="admin" />
		</div>

		<q-table
			:data="filteredTasks"
			:columns="columns"
			:filter="filter"
			wrap-cells
			:grid="$q.screen.lt.sm"
			row-key="id"
			separator="cell"
			:pagination="pagination"
			:rows-per-page-options="[10,15,25,50,100,0]">

			<template v-slot:top-left>
				<div class="text-h6">Ongoing Tasks</div>
			</template>

			<template v-slot:top-right>
				<q-input borderless v-model="filter" placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>

				<q-btn icon="event" color="primary" flat round class="q-ml-md">
					<q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
						<q-date title="Date Due" v-model="filters.dateDue" range>
							<div class="row items-center justify-end">
								<q-btn label="Reset" @click="resetDate" color="primary" flat />
								<q-btn v-close-popup label="Close" color="primary" flat />
							</div>
						</q-date>
					</q-popup-proxy>
				</q-btn>

				<q-btn flat round icon="archive" color="primary" class="q-ml-md" @click="downloadTasks"></q-btn>
			</template>

			<template v-slot:top-row>
				<q-tr>
					<q-td colspan="100%">
						<span v-if="filters.dateDue.from && filters.dateDue.to">From {{filters.dateDue.from}} to {{filters.dateDue.to}}</span>
						<span v-else>No filters</span>
					</q-td>
				</q-tr>
			</template>

			<template v-slot:body-cell-overdue="props">
				<q-td :props="props">
					<q-icon name="priority_high" color="red" v-if="props.row.overdue" />
				</q-td>
			</template>

			<template v-slot:body-cell-forOpening="props">
				<q-td :props="props">
					<q-icon :name="props.row.forOpening ? 'check_box' : 'check_box_outline_blank' " v-if="props.row.forOpening" size="sm" color="green" />
				</q-td>
			</template>

			<template v-slot:body-cell-actions="props" v-if="admin">
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

			<template v-slot:no-data="{ filter }">
        <div class="full-width row flex-center q-gutter-sm" :class="filter ? 'text-negative' : 'text-positive'">
          <span>
            {{ filter ? `No data found for ${filter}` : 'Hooray! You don\'t have a pending task...' }}
          </span>
          <q-icon size="2em" :name="filter ? 'sentiment_dissatisfied' : 'sentiment_satisfied_alt'" />
        </div>
      </template>

      <template v-slot:item="props">
      	<div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
	      	<q-card>
	      		<q-card-section class="q-pa-none">
	      			<q-list>
								<q-item>
									<q-item-section>
										<q-item-label caption>Date Assigned</q-item-label>
										<q-item-label>{{ props.row.dateAssigned | formatDate }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Document</q-item-label>
										<q-item-label>{{ props.row.document }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Enduser</q-item-label>
										<q-item-label>{{ props.row.enduser }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Reference Number</q-item-label>
										<q-item-label>{{ props.row.referenceNo }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Particulars</q-item-label>
										<q-item-label>{{ props.row.particulars }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>RFQ Deadline</q-item-label>
										<q-item-label>{{ props.row.rfqDeadline }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Due Date/Time</q-item-label>
										<q-item-label>{{ props.row.dateDue }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Action Taken</q-item-label>
										<q-item-label>{{ props.row.actionTaken }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Remarks</q-item-label>
										<q-item-label>{{ props.row.remarks }}</q-item-label>
									</q-item-section>
								</q-item>
								<q-item>
									<q-item-section>
										<q-item-label caption>Status</q-item-label>
										<q-item-label>
											<div>
												<q-badge color="positive" v-if="props.row.status === 'completed'">COMPLETED</q-badge>
												<q-badge color="primary" v-if="props.row.status === 'ongoing'">ONGOING</q-badge>
												<q-badge color="negative" v-if="props.row.status === 'deleted'">DELETED</q-badge>
											</div>
										</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
	      		</q-card-section>
	      		<q-card-actions align="right" v-if="admin">
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
	      		</q-card-actions>
	      	</q-card>
      	</div>
      </template>
		</q-table>

		<q-dialog v-model="addTaskDialog" persistent>
			<div style="width: 400px; max-width: 80wh;">
				<add-edit-task :task="task" @close="addTaskDialog = false" :cancel="true"></add-edit-task>
			</div>
		</q-dialog>

	</q-page>
</template>

<script>
	import { parseDate, exportTable } from 'src/functions'
	import { date } from 'quasar'

	export default {
		components: {
			'add-edit-task': () => import('../components/AddEditTask.vue'),
		},
		name: 'PageTasks',
		computed: {
			tasks() {
				// define additional data here instead
				return this.$store.getters['task/ongoing']
			},
			admin() {
				return this.$store.getters['auth/admin']
			},
			columnNames() {
				const columnNames = this.columns.map(c => c.name)
				console.log(columnNames)
				return columnNames
			},
			dateRange() {
				return `${this.filters.dateDue.from} - ${this.filters.dateDue.to}`
			},
			filteredTasks() {
				const from = this.filters.dateDue.from ? this.filters.dateDue.from : ''
				const to = this.filters.dateDue.to ? this.filters.dateDue.to : ''
				let filteredTasks = []

				const tasks = this.tasks

				if (from && to) {
					filteredTasks = tasks.filter(t => {
						console.log(t)
						return (date.isBetweenDates(t.dateDue, from, to, { inclusiveFrom: true, inclusiveTo: true }))
					})
				} else {
					filteredTasks = tasks
				}

				return filteredTasks
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
					abc: 0,
					enduser: '',
					referenceNo: '',
					actionTaken: '',
					assignedTo: '',
					remarks: '',
					dateDue: '',
					forOpening: false
				},
				filter: '',
				filters: {
					dateAssigned: '',
					dateDue: {
						from: '',
						to: ''
					}
				},
				columns: [
					{
						name: 'overdue',
						label: 'Overdue',
						field: 'overdue',
						align: 'center'
					},
					{
						name: 'dateAssigned',
						label: 'Date Assigned',
						field: row => date.formatDate(parseDate(row.dateAssigned),'MMM D, YYYY hh:mm A'),
						sortable: true,
						sort: (a, b) =>  new Date(parseDate(a)) - new Date(parseDate(b)),
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
						sort: (a, b) =>  new Date(parseDate(a)) - new Date(parseDate(b)),
						align: 'center'
					},
					{
						name: 'forOpening',
						label: 'For Opening',
						field: row => row.forOpening || false,
						align: 'center'
					},
					{
						name: 'dateDue',
						label: 'Due Date/Time',
						field: row => (row.dateDue ?  date.formatDate(parseDate(row.dateDue),'MMM D, YYYY hh:mm A') : ''),
						sort: (a, b) => new Date(parseDate(a)) - new Date(parseDate(b)),
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
				],
				pagination: {
					rowsPerPage: 10,
					sortBy: 'dateDue',
					descending: true
				}
			}
		},
		methods: {
			addTask() {
				this.task = {
					id: null,
					document: '',
					particulars: '',
					rfqDeadline: '',
					abc: 0,
					enduser: '',
					referenceNo: '',
					actionTaken: '',
					assignedTo: '',
					remarks: '',
					dateDue: '',
					forOpening: false
				}

				this.addTaskDialog = true
			},
			completeTask(row) {
				// mark as completed
				this.$q.dialog({
					title: 'Complete Task',
					message: 'Mark task as completed? If the task has a set RFQ deadline, it will be added to <strong>For Opening.</strong>',
					html: true,
					cancel: true,
					persistent: true
				})
				.onOk(() => this.$store.dispatch('task/completeTask', row))
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
			},
			downloadTasks() {
				exportTable(this.filteredTasks, this.columns, 'ongoing tasks.csv')
			},
			resetDate() {
				this.filters.dateDue.from = ''
				this.filters.dateDue.to = ''
			}
		},
		filters: {
			formatDate(val) {
				if (val) {
					const dateToFormat = parseDate(val)
					return date.formatDate(dateToFormat, 'MMM DD, YYYY hh:mm A')
				}
				return ''
			}
		}
	}
</script>
