<template>
	<zingchart :data="chartConfig" />
</template>

<script>
	export default {
		name: 'StackChart',
		props: ['entries'],
		computed: {
			chartConfig() {
				return {
				  type: 'bar',
				  plot: {
				    stacked: true,
				    'stack-type': "normal" /* Optional specification */
				  },
				  series: [
				    { values: [20,40,25,50,15,45,33,34] },
				    { values: [5,30,21,18,59,50,28,33] },
				    { values: [30,5,18,21,33,41,29,15] }
				  ]
				}
			}
		}
	}
</script>