<template>
	<q-page padding>
		<q-table
			:title="`For Opening (${openings.length})`"
			flat
			bordered
			:data="filteredOpenings"
			:columns="columns"
			row-key="id"
			separator="cell"
			:filter="filter"
			:grid="$q.screen.lt.sm">
			<template v-slot:top-right>
				<q-input v-model="filter" borderless placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
				<q-btn @click="customExport" icon="archive" flat round class="q-ml-md"></q-btn>
				<q-btn @click="setFilterByStatus" icon="filter_alt" flat round class="q-ml-md"></q-btn>
			</template>

			<template v-slot:body-cell-overdue="props">
				<q-td :props="props" :class="overdue(props.row.rfqDeadline, props.row.dateOpened) ? 'bg-red-1' : ''">
					<q-icon v-if="overdue(props.row.rfqDeadline, props.row.dateOpened)" name="priority_high" color="negative"></q-icon>
				</q-td>
			</template>

			<template v-slot:body-cell-task="props">
				<q-td :props="props">
					<q-btn flat round dense color="primary" icon="launch" :to="`/tasks/${props.row.taskId}`" v-if="props.row.taskId"></q-btn>
				</q-td>
			</template>

			<template v-slot:body-cell-actions="props">
				<q-td :props="props" v-if="admin">
					<q-btn icon="check" flat round dense color="positive" @click="openItem(props.row.id)" v-if="!props.row.opened"></q-btn>
					<!-- <q-btn icon="edit" flat round dense color="primary" @click="editItem(props.row)"></q-btn> -->
					<q-btn icon="delete" flat round dense color="negative" @click="deleteItem(props.row.id)" v-if="!props.row.opened"></q-btn>
				</q-td>
			</template>

			<template v-slot:item="props">
				<div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
	        >
					<q-card :class="props.row.opened ? 'bg-green-2': void 0">
						<q-card-section class="q-pa-none">
							<q-list dense>
	              <q-item v-for="col in props.cols.filter(col => (col.name !== 'actions' && col.name !== 'task'))" :key="col.name">
	                <q-item-section>
	                  <q-item-label caption>{{ col.label }}</q-item-label>
	                </q-item-section>
	                <q-item-section side>
	                  <q-item-label class="text-weight-bold text-black">{{ col.value }}</q-item-label>
	                </q-item-section>
	              </q-item>
	            </q-list>
						</q-card-section>
						<q-card-actions align="right" v-if="admin">
							<q-btn flat round dense color="primary" icon="launch" :to="`/tasks/${props.row.taskId}`" v-if="props.row.taskId"></q-btn>
							<q-btn icon="check" flat round dense color="positive" @click="openItem(props.row.id)" v-if="!props.row.opened"></q-btn>
							<q-btn icon="delete" flat round dense color="negative" @click="deleteItem(props.row.id)" v-if="!props.row.opened"></q-btn>
						</q-card-actions>
					</q-card>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script>
	import { parseDate, wrapCsvValue } from 'src/functions'
	import { date, exportFile } from 'quasar'

	export default {
		name: 'ForOpening',
		computed: {
    	openings() {
    		const openings = this.$store.state.opening.openings

				return Object.entries(openings).map(([key, value]) => {
					return {
						...value,
						id: key
					}
				}).filter(o => {
					return !o.deleted
				})
    	},
    	admin() {
    		return this.$store.getters['auth/admin']
    	},
			filteredOpenings() {
				const openings = this.openings,
					filterByResult = this.filterByResult
				let filteredOpenings = []

				if (!filterByResult.length) {
					filteredOpenings = openings
    		} else {
					filteredOpenings = openings.filter(o => {
						return (o.result && filterByResult.includes(o.result))
					})
				}

				return filteredOpenings
			}
		},
		data() {
			return {
				filter: '',
				filterByResult: [],
				selectedColumns: ['assignedTo','enduser','document','referenceNo','rfqDeadline','dateOpened','result'],
				columns: [
					{
						name: 'overdue',
						label: 'Overdue',
						align: 'center'
					},
					{
						name: 'assignedTo',
						label: 'Assigned To',
						field: 'assignedName',
						align: 'center',
						sortable: true
					},
					{
						name: 'enduser',
						label: 'Enduser',
						field: 'enduser',
						align: 'center',
						sortable: true
					},
					{
						name: 'document',
						label: 'Document',
						field: 'document',
						align: 'center',
						sortable: true
					},
					{
						name: 'referenceNo',
						label: 'Reference Number',
						field: 'referenceNo',
						align: 'center',
						sortable: true
					},
					{
						name: 'rfqDeadline',
						label: 'RFQ Deadline',
						field: row => date.formatDate(parseDate(row.rfqDeadline), 'MMM DD, YYYY hh:mm A'),
						align: 'center',
						sortable: true
					},
					{
						name: 'dateOpened',
						label: 'Date Opened',
						field: row => date.formatDate(parseDate(row.dateOpened), 'MMM DD, YYYY hh:mm A'),
						align: 'center',
						sortable: true
					},
					{
						name: 'result',
						label: 'Result',
						field: row => row.result,
						align: 'center'
					},
					{
						name: 'task',
						label: 'Task',
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
			openItem(id) {
				const options = [
					{
						label: 'TWG for Evaluation',
						value: 'TWG for Evaluation'
					},
					{
						label: 'Failed',
						value: 'Failed'
					}
				]
				this.$q.dialog({
					title: 'Mark as Opened',
					message: 'Mark this item as opened?',
					cancel: true,
					persistent: true,
					options: {
						model: '',
						type: 'radio',
						items: options,
						isValid: val => !!val
					}
				}).onOk(data => this.$store.dispatch('opening/open', {
					result: data,
					id: id
				}))
			},
			editItem(row) {

			},
			updateItem(id) {

			},
			deleteItem(id) {
				this.$q.dialog({
					title: 'Confirm Delete',
					message: 'Are you sure you want to delete this item? Type <strong>Yes</strong> to confirm.',
					persistent: true,
					html: true,
					cancel: true,
					prompt: {
						model: '',
						type: 'text',
						isValid: val => (val.toLowerCase() === 'yes')
					}
				}).onOk(() => this.$store.dispatch('opening/delete', id))
			},
			overdue(rfqDeadline, dateOpened) {
				return (!dateOpened && date.getDateDiff(rfqDeadline, new Date(), 'seconds') < 0)
			},
			setFilterByStatus() {
				const options = [
					{
						label: 'TWG for Evaluation',
						value: 'TWG for Evaluation'
					},
					{
						label: 'Failed',
						value: 'Failed'
					}
				]
				this.$q.dialog({
					title: 'Filter By Result',
					options: {
						type: 'checkbox',
						model: this.filterByResult,
						items: options
					},
					cancel: true
				}).onOk(data => {
					this.filterByResult = data
				})
			},
			customExport() {
				const items = [
					'assignedTo',
					'enduser',
					'document',
					'referenceNo',
					'rfqDeadline',
					'dateOpened',
					'result'
				]
				const options = items.map(o => ({ value: o, label: o }))
				this.$q.dialog({
					title: 'Custom Export',
					message: 'Select columns to export',
					options: {
						model: this.selectedColumns,
						items: options,
						type: 'checkbox',
						isValid: val => !!val
					},
					cancel: true
				}).onOk(data => {
					const selectedColumns = this.columns.filter(c => {
						console.log(c)
						return data.includes(c.name)
					})
					this.exportTable(selectedColumns)
				})
			},
			exportTable(columns) {
				const content = [ columns.map(col => wrapCsvValue(col.label)) ].concat(
					this.filteredOpenings.map(row => columns.map(col => wrapCsvValue(
						typeof col.field === 'function'
							? col.field(row)
							: row[col.field === void 0 ? col.name : col.field],
						col.format
					)).join(','))
				).join('\r\n')

				const status = exportFile(
					'for opening.csv',
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
