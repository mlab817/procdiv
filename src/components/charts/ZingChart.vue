<template>
	<zingchart :data="chartConfig"></zingchart>
</template>

<script>
	import _ from 'lodash'

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
					acc[entry[groupBy]] = acc[entry[groupBy]] || 0
					acc[entry[groupBy]]++

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
				      effect: 'ANIMATION_FADE_IN'
				    },
				    valueBox: {
				      text: '%t',
				      fontSize: 12,
				      offsetR: '30%'
				    },
					}
				}
				console.log(chartConfig)
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