<template>
	<zingchart :data="chartConfig" output="canvas"></zingchart>
</template>

<script>
	import _ from 'lodash'
	import { date } from 'quasar'

	export default {
		name: 'ZingChart',
		props: {
			title: {
				type: String,
				default: 'Title'
			},
			type: {
				type: String,
				default: 'bar',
				validator: (val) => {
					return ['bar','line','column','pie','calendar'].indexOf(val) !== -1
				}
			},
			entries: {
				type: Object,
				default: () => {
					return {}
				}
			},
			groupBy: {
				type: String,
				default: ''
			},
			groupType: {
				type: String,
				default: 'string'
			},
			legend: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			values() {
				// must return array of values
				const entriesArray = this.entriesArray
				const groupBy = this.groupBy

				const categories = this.entriesArray.reduce((acc, entry) => {
					let grouping
					if (this.groupType === 'date') {
						grouping = date.formatDate(entry[groupBy],'YYYY-MM-DD')
					} else {
						grouping = entry[groupBy]
					}

					acc[grouping] = acc[grouping] || 0
					acc[grouping]++

					return acc
				}, {})
				
				return Object.keys(categories).map(name => {
					return {
						values: [categories[name]],
						text: name
					}
				})
			},
			chartConfig() {
				const chartConfig = {
					type: this.type,
					title: {
						text: this.title
					},
					legend: this.legend ? {} : null,
					series: this.values.map(o => o),
					plot: {
						layout: 'auto',
				    animation: {
		          effect: 'ANIMATION_EXPAND_BOTTOM',
		          method: 'ANIMATION_REGULAR_EASE_IN',
		          sequence: 'ANIMATION_BY_NODE',
		          speed: 300
		        },
				    valueBox: {
				      text: '%t',
				      fontSize: 12,
				      offsetR: '30%'
				    },
					}
				}
				return chartConfig
			},
			entriesArray() {
				const entries = this.entries
				// map returns a new array
				return Object.keys(entries).map(key => {
					return {
						...entries[key],
						id: key,
						value: 1
					}
				})
			}
		}
	}
</script>