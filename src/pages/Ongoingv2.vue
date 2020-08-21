<template>
	<q-page padding>
		<q-table :data="ongoing" :pagination="pagination" wrap-cells :filter="filter" :columns="columns">
			<template v-slot:top-right>
				<q-input borderless v-model="filter">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
		</q-table>
	</q-page>
</template>

<script>
	import { parseDate } from 'src/functions'
	import { date } from 'quasar'

	export default {
		name: 'PageOngoing',
		computed: {
			ongoing() {
				const ongoing = this.$store.getters['assignment/ongoing']
				let array = []

				Object.keys(ongoing).forEach(key => {
					const task = ongoing[key]
					array.push({ id:key, ...task })
				})

				return array
			}
		},
		data() {
			return {
				pagination: {
					rowsPerPage: 100
				},
				filter: '',
				columns: [
					{
						name: 'dateAssigned',
						label: 'Date Assigned',
						field: row => date.formatDate(parseDate(row.dateAssigned), 'MMM DD, YYYY')
					},
					{
						name: 'document',
						label: 'Document',
						field: 'document'
					},
					{
						name: 'referenceNo',
						label: 'Reference Number',
						field: 'referenceNo'
					}
				]
			}
		}
	}
</script>