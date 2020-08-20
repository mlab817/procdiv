<template>
	<q-page padding>
		<q-table flat bordered :data="forOpening" :columns="columns"></q-table>
	</q-page>
</template>

<script>
	export default {
		name: 'ForOpening',
		computed: {
			forOpening() {
				let array = []
      	const forOpening = this.$store.getters['assignment/forOpening']

      	Object.keys(forOpening).forEach(key => {
      		array.push({
      			id: key,
      			...forOpening[key]
      		})
      	})

      	return array
    	}
		},
		data() {
			return {
				columns: [
					{
						name: 'id',
						label: 'ID',
						field: 'id'
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
					},
					{
						name: 'assignedTo',
						label: 'Assigned To',
						field: 'assignedTo'
					}
				]
			}
		}
	}
</script>