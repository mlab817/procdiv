<template>
	<zingchart :data="chartConfig"></zingchart>
</template>

<script>
	import { date } from 'quasar'

	export default {
		name: 'CalendarChart',
		props: ['entries'],
		computed: {
			chartConfig() {
				const config = {
					type: 'bar',
					title: {
						text: 'Tasks by Date Assigned'
					},
					series: [
						{values: this.values }
					]
				}
				console.log(config)
				return config
			},
			values() {
				const grouped = this.entries.reduce((acc, entry) => {
					const dateAssigned = date.formatDate(entry.dateAssigned,'YYYY-MM-DD')
					acc[dateAssigned] = acc[dateAssigned] || 0
					acc[dateAssigned]++
					return acc
				}, {})

				const keysOrdered = Object.keys(grouped)

				keysOrdered.sort((a, b) => {
					if (a > b) return 1
					else if (a < b) return -1
					else return 0
				})

				const sorted = {}
				keysOrdered.forEach(key => {
					sorted[key] = grouped[key]
				})

				return Object.keys(sorted).map(key => {
					return [key, sorted[key]]
				})
			}
		},
		data() {
			return {
				
			}
		}
	}
</script>