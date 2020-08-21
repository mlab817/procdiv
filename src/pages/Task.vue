<template>
	<q-page padding>
		<div class="text-h6">Task Detail</div>

		<q-card bordered flat class="q-mt-md">
			<q-list separator>
				<q-item>
					<q-item-section>Document</q-item-section>
					<q-item-section>{{task.document}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Enduser</q-item-section>
					<q-item-section>{{task.enduser}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Reference Number</q-item-section>
					<q-item-section>{{task.referenceNo}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Particulars</q-item-section>
					<q-item-section>{{task.particulars}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>RFQ Deadline</q-item-section>
					<q-item-section>{{task.rfqDeadline}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Action Taken</q-item-section>
					<q-item-section>{{task.actionTaken}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Remarks</q-item-section>
					<q-item-section>{{task.remarks}}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>Status</q-item-section>
					<q-item-section>
						<div>
							<q-badge color="positive" v-if="task.status === 'completed'">COMPLETED</q-badge>
							<q-badge color="primary" v-if="task.status === 'ongoing'">ONGOING</q-badge>
							<q-badge color="negative" v-if="task.status === 'deleted'">DELETED</q-badge>
						</div>
					</q-item-section>
				</q-item>
			</q-list>
		</q-card>
	</q-page>
</template>

<script>
	export default {
		name: 'TaskDetail',
		computed: {
			task() {
				const id = this.$route.params.id
				const tasks = this.$store.state.task.tasks
				const task = tasks[id]

				if (task) return task
				return null
			}
		}
	}
</script>