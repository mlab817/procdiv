<template>
	<q-table 
		:title="title" 
		:data="data" 
		:columns="columns" 
		:filter="filter" 
		wrap-cells 
		:grid="$q.screen.lt.sm" 
		row-key="id" 
		separator="cell" 
		:pagination="pagination"
		:rows-per-page-options="[10,15,25,50,100,0]">
	<template v-slot:top-right>
		<q-input borderless v-model="filter" placeholder="Search">
			<template v-slot:append>
				<q-icon name="search" />
			</template>
		</q-input>
		<q-btn 
			flat 
			round 
			icon="archive" 
			color="primary" 
			class="q-ml-md" 
			@click="downloadData"></q-btn>
	</template>

	<template v-slot:top-row>
		<q-tr>
			
		</q-tr>
	</template>

	<template v-slot:body-cell-overdue="props">
		<q-td :props="props">
			<q-icon name="priority_high" color="red" v-if="overdue" />
		</q-td>
	</template>

	<template v-slot:body-cell-dateDue="props">
		<q-td :props="props">
			{{ props.row.dateDue }}
		</q-td>
	</template>

	<template v-slot:body-cell-actions="props" v-if="admin">
		<q-td :props="props">
			<div>
				<q-btn icon="check" flat round dense color="positive" @click="completeTask(props.row)">
					<q-tooltip>Mark as completed</q-tooltip>
				</q-btn>
				<q-btn icon="edit" flat round dense color="primary" @click="editTask(props.row)">
					<q-tooltip>Edit</q-tooltip>
				</q-btn>
				<q-btn icon="delete" flat round dense color="negative" @click="deleteTask(props.row)">
					<q-tooltip>Delete</q-tooltip>
				</q-btn>
				<q-btn icon="notifications" flat round dense color="grey" @click="remindTask(props.row)" :disabled="props.row.reminded">
					<q-tooltip>Remind!</q-tooltip>
				</q-btn>
			</div>
		</q-td>
	</template>

	<template v-slot:no-data="{ filter }">
    <div class="full-width row flex-center q-gutter-sm" :class="filter ? 'text-negative' : 'text-positive'">
      <span>
        {{ filter ? `No data found for ${filter}` : 'Hooray! You don\'t have a pending task...' }}
      </span>
      <q-icon size="2em" :name="filter ? 'sentiment_dissatisfied' : 'sentiment_satisfied_alt'" />
    </div>
  </template>

  <template v-slot:item="props">
  	<div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
    	<q-card>
    		<q-card-section class="q-pa-none">
    			<q-list>
						<q-item>
							<q-item-section>
								<q-item-label caption>Date Assigned</q-item-label>
								<q-item-label>{{ props.row.dateAssigned | formatDate }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Document</q-item-label>
								<q-item-label>{{ props.row.document }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Enduser</q-item-label>
								<q-item-label>{{ props.row.enduser }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Reference Number</q-item-label>
								<q-item-label>{{ props.row.referenceNo }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Particulars</q-item-label>
								<q-item-label>{{ props.row.particulars }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>RFQ Deadline</q-item-label>
								<q-item-label>{{ props.row.rfqDeadline }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Due Date/Time</q-item-label>
								<q-item-label>{{ props.row.dateDue }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Action Taken</q-item-label>
								<q-item-label>{{ props.row.actionTaken }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Remarks</q-item-label>
								<q-item-label>{{ props.row.remarks }}</q-item-label>
							</q-item-section>
						</q-item>
						<q-item>
							<q-item-section>
								<q-item-label caption>Status</q-item-label>
								<q-item-label>
									<div>
										<q-badge color="positive" v-if="props.row.status === 'completed'">COMPLETED</q-badge>
										<q-badge color="primary" v-if="props.row.status === 'ongoing'">ONGOING</q-badge>
										<q-badge color="negative" v-if="props.row.status === 'deleted'">DELETED</q-badge>
									</div>
								</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
    		</q-card-section>
    		<q-card-actions align="right" v-if="admin">
    			<q-btn icon="check" flat round dense color="positive" @click="completeTask(props.row)">
						<q-tooltip>Mark as completed</q-tooltip>
					</q-btn>
					<q-btn icon="edit" flat round dense color="primary" @click="editTask(props.row)">
						<q-tooltip>Edit</q-tooltip>
					</q-btn>
					<q-btn icon="delete" flat round dense color="negative" @click="deleteTask(props.row)">
						<q-tooltip>Delete</q-tooltip>
					</q-btn>
					<q-btn icon="notifications" flat round dense color="grey" @click="remindTask(props.row)" :disabled="props.row.reminded">
						<q-tooltip>Remind!</q-tooltip>
					</q-btn>
    		</q-card-actions>
    	</q-card>
  	</div>
  </template>
</q-table>
</template>

<script>
	import { exportTable } from 'src/functions'

	export default {
		name: 'TableComponent',
		props: [
			'data',
			'columns',
			'title'
		],
		computed: {
			admin() {
				return this.$store.getters['auth/admin']
			}
		},
		data() {
			return {
				filter: '',
				pagination: {
					rowsPerPage: 0
				}
			}
		},
		methods: {
			downloadData() {
				exportTable(this.data, this.columns, 'export.csv')
			}
		}
	}
</script>