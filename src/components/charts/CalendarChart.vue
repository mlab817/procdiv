<template>
	<zingchart :data="chartConfig"></zingchart>
</template>

<script>
	import { date } from 'quasar'

	export default {
		name: 'CalendarChart',
		props: ['entries','groupBy','title'],
		computed: {
			chartConfig() {
				const config = {
					type: 'bar',
					title: {
						text: this.title
					},
					series: [
						{values: this.values }
					],
					plot: {
						animation: {
		          effect: 'ANIMATION_EXPAND_BOTTOM',
		          method: 'ANIMATION_REGULAR_EASE_IN',
		          sequence: 'ANIMATION_BY_NODE',
		          speed: 300
		        },
					}
				}
				console.log(config)
				return config
			},
			values() {
				const grouped = this.entries.reduce((acc, entry) => {
					const dateAssigned = date.formatDate(entry[this.groupBy],'YYYY-MM-DD') || 'N/A'
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