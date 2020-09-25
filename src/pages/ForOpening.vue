<template>
	<q-page padding>

		<q-table
			:title="`For Opening (${arrayOpenings.length})`"
			flat
			bordered
			:data="filteredOpenings"
			:columns="columns"
			row-key="id"
			separator="cell"
			:pagination="pagination"
			:filter="filter"
			:grid="$q.screen.lt.sm">
			<template v-slot:top-right>
				<q-input v-model="filter" borderless placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
				<q-btn @click="customExport" color="primary" icon="archive" flat round class="q-ml-md"></q-btn>
			</template>

			<template v-slot:top-row>
        <q-tr class="bg-grey-1">
          <q-td></q-td>
          <q-td>
            <q-input v-model="filters.assignedName" dense borderless placeholder="Search Assigned" input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.enduser" dense borderless placeholder="Search Enduser" input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.document" dense borderless placeholder="Search Document" input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.referenceNo" dense borderless placeholder="Search Reference No." input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.rfqDeadline" dense borderless placeholder="Search RFQ Deadline" input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.dateOpened" dense borderless placeholder="Search Date Opened" input-class="text-center"></q-input>
          </q-td>
          <q-td>
            <q-input v-model="filters.result" dense borderless placeholder="Search Result" input-class="text-center"></q-input>
          </q-td>
          <q-td></q-td>
          <q-td></q-td>
        </q-tr>
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

			<template v-slot:bottom>
				<div>Filters will be applied in exported file.</div>
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
			admin() {
    		return this.$store.getters['auth/admin']
    	},
    	arrayOpenings() {
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
			filteredOpenings() {
				const openings = this.arrayOpenings,
					filterByResult = this.filterByResult,
					filters = this.filters,
					filterProperty = this.filterProperty
				let filteredOpenings = []

				filteredOpenings = openings.filter(o => {
					console.log(o)
					return (filterProperty(o.assignedName, filters.assignedName) && 
							filterProperty(o.enduser, filters.enduser) &&
							filterProperty(o.document, filters.document) &&
							filterProperty(o.referenceNo, filters.referenceNo) &&
							filterProperty(o.rfqDeadline, filters.rfqDeadline) &&
							filterProperty(o.dateOpened, filters.dateOpened) &&
							filterProperty(o.result, filters.result)
						)
				})
				
				return filteredOpenings
			}
		},
		data() {
			return {
				filter: '',
				filterByResult: [],
				filters: {
					assignedName: '',
					enduser: '',
					document: '',
					referenceNo: '',
					rfqDeadline: '',
					dateOpened: '',
					result: '',
				},
				pagination: {
					rowsPerPage: 0
				},
				selectedColumns: ['assignedName','enduser','document','referenceNo','rfqDeadline','dateOpened','result'],
				columns: [
					{
						name: 'overdue',
						label: 'Overdue',
						align: 'center'
					},
					{
						name: 'assignedName',
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
			filterProperty(property, filter) {
				const prop = property && property.toLowerCase()
				const filt = filter && filter.toLowerCase()

				/* 	
				 *  if filter is empty return true, nothing is being filtered
				 *	if prop is empty while filter is not empty return false
				 *	otherwise return true
				*/

				return filt ? (prop ? prop.includes(filt) : false) : true
			},
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
					'assignedName',
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
