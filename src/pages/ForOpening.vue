<template>
	<q-page padding>
		<q-table title="For Opening" flat bordered :data="openings" :columns="columns" row-key="id" separator="cell" :filter="filter" :grid="$q.screen.lt.sm">
			<template v-slot:top-right>
				<q-input v-model="filter" borderless placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
			
			<template v-slot:body-cell-task="props">
				<q-td :props="props">
					<q-btn flat round dense color="primary" icon="launch" :to="`/tasks/${props.row.taskId}`" v-if="props.row.taskId"></q-btn>
				</q-td>
			</template>

			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn icon="check" flat round dense color="positive" @click="openItem(props.row.id)" v-if="!props.row.opened"></q-btn>
					<!-- <q-btn icon="edit" flat round dense color="primary" @click="editItem(props.row)"></q-btn> -->
					<q-btn icon="delete" flat round dense color="negative" @click="deleteItem(props.row.id)" v-if="!props.row.opened"></q-btn>
				</q-td>
			</template>
		</q-table>
	</q-page>
</template>

<script>
	import { parseDate } from 'src/functions'
	import { date } from 'quasar'

	export default {
		name: 'ForOpening',
		computed: {
    	openings() {
    		const openings = this.$store.state.opening.openings
    		let array = []

    		Object.keys(openings).forEach(key => {
    			const opening = openings[key]

    			if (!opening.deleted) {
    				array.push({
	    				id: key,
	    				...opening
	    			})
    			}    			
    		})

    		return array
    	}
		},
		data() {
			return {
				filter: '',
				columns: [
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
				this.$q.dialog({
					title: 'Mark as Opened',
					message: 'Mark this item as opened?',
					cancel: true,
					persistent: true
				}).onOk(() => this.$store.dispatch('opening/open', id))
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
			}
		}
	}
</script>