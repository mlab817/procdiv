<template>
	<q-card>
		<q-card-section class="row justify-between">
			<div class="text-h6">Help</div>
			<q-btn flat round v-close-popup icon="close" />
		</q-card-section>
		<q-card-section class="q-pa-none">
			<q-list>
				<q-item>
					<q-item-section>
						<q-item-label caption>Date Assigned</q-item-label>
						<q-item-label>Automatically generated once a task is created</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Document</q-item-label>
						<q-item-label>Action assigned to the user/staff</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Particulars</q-item-label>
						<q-item-label>Additional information on the task (may include specifics of the document to be processed)</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>RFQ Deadline</q-item-label>
						<q-item-label>Date and time when the RFQ is due for opening</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Endusers</q-item-label>
						<q-item-label>Concerned endusers who own the document for processing</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Reference Number(s)</q-item-label>
						<q-item-label>May refer to PR/PRAS/IB/Resolution number(s)</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Action Taken</q-item-label>
						<q-item-label>Action taken by self</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Assigned To</q-item-label>
						<q-item-label>Staff/user assigned to the task. User will be notified.</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Remarks</q-item-label>
						<q-item-label>Updates to the task (e.g. action taken by user, next steps, etc.)</q-item-label>
					</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>
						<q-item-label caption>Due Date/Time</q-item-label>
						<q-item-label>Date and time when the assignment is due</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn flat color="primary" label="Close" v-close-popup />
		</q-card-actions>
	</q-card>
</template>