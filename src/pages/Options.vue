<template>
	<q-page padding>
		<q-toolbar>
			<q-toolbar-title>Manage Options</q-toolbar-title>
		</q-toolbar>

		<q-tabs v-model="tab">
			<q-tab name="documents" label="Documents"></q-tab>
			<q-tab name="endusers" label="Enduser"></q-tab>
			<q-tab name="staff" label="Staff"></q-tab>
		</q-tabs>

		<q-tab-panels v-model="tab" animated>
			<q-tab-panel name="documents">
				<document-table class="q-mt-md"></document-table>
			</q-tab-panel>
			
			<q-tab-panel name="endusers">
				<enduser-table class="q-mt-md"></enduser-table>
			</q-tab-panel>

			<q-tab-panel name="staff">
				<staff-table class="q-mt-md"></staff-table>
			</q-tab-panel>
		</q-tab-panels>

	</q-page>
</template>

<script>
	export default {
		components: {
			'enduser-table': () => import('../components/options/EnduserTable.vue'),
			'document-table': () => import('../components/options/DocumentTable.vue'),
			'staff-table': () => import('../components/options/StaffTable.vue'),
		},
		name: 'PageOptions',
		data() {
			return {
				tab: 'documents'
			}
		}
	}
</script>