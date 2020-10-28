<template>
	<q-page padding>
		<add-edit-task :cancel="false" :task="task" />
	</q-page>
</template>

<script>
	export default {
		name: 'AddTask',
		components: {
			'add-edit-task': () => import('../components/AddEditTask.vue')
		},
		data() {
			return {
				task: {
					id: null,
					document: '',
					particulars: '',
					rfqDeadline: '',
					enduser: '',
					referenceNo: '',
					actionTaken: '',
					assignedTo: '',
					remarks: '',
					dateDue: '',
					abc: 0
				}
			}
		}
	}
</script>
