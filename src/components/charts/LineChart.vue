<template>
	<div class="col" style="width: 100wh;">
		<zingchart :data="chartData" />
	</div>
</template>

<script>
	import _ from 'lodash'
	import { date } from 'quasar'

	export default {
		name: 'LineChart',
		props: {
			title: String,
			series: Array,
			type: String,
			entries: Object
		},
		computed: {
			values() {
				const array = [], newArray = []
				Object.keys(this.entries).forEach(key => {
					const entry = this.entries[key]
					array.push({
						...entry,
						id: key,
						dateAssigned: date.formatDate(entry.dateAssigned,'YYYY-MM-DD')
					})
				})
				const group = _.groupBy(array, 'dateAssigned')
				Object.keys(group).forEach(key => {
					newArray.push([key,group[key].length])
				})

				return _.sortBy(newArray)
			},
			chartData() {
				return {
					type: this.type,
	        title: {
	        	text: this.title
	        },
	        series: [{
	        	values: this.values
	        }]
				}
      }
		}
	}
</script>