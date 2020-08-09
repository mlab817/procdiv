<template>
	<div>
		<q-btn 
			:icon="start ? 'filter_alt' : 'filter_list'" 
			:label="$q.screen.gt.sm ? 'Filter': void 0" 
			class="q-mr-sm btn-filter" 
			color="positive"
			@click="filterDialog = true"></q-btn>

		<q-dialog v-model="filterDialog">
			<q-card style="min-width: 300px;">
				<q-card-section class="row justify-between">
					<div class="text-h6">Filter by Date</div>
					<q-space/>
					<q-btn icon="close" flat round dense v-close-popup></q-btn>
				</q-card-section>
				<q-card-section>
					<q-input type="date" label="Start" stack-label v-model="start" />
					<q-input type="date" label="End" stack-label v-model="end" :min="start" v-if="start" />
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Clear" color="primary" @click="clear"></q-btn>
					<q-btn label="Ok" color="primary" @click="filterAssignments"></q-btn>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				filterDialog: false,
				start: '',
				end: ''
			}
		},
		methods: {
			filterAssignments() {
				const payload = {
					start: this.start,
					end: this.end
				}

				this.$store.dispatch('assignment/filterByDate', payload)
				this.filterDialog = false
			},
			clear() {
				this.start = ''
				this.end = ''
			}
		},
		mounted() {
			this.start = this.$store.state.assignment.start
			this.end = this.$store.state.assignment.end
		}
	}
</script>

<style>
  .btn-filter {
    height: 40px;
  }
</style>