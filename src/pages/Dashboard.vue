<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>
        Ongoing Assignments
      </q-toolbar-title>
    </q-toolbar>

    <div class="row q-col-gutter-md">
      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card square flat bordered>
          <q-card-section>
            <div class="text-h6">By Staff</div>
          </q-card-section>
          <q-card-section>
            <pie-chart :data="groupedAssignments" legend="right" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card square flat bordered>
          <q-card-section>
            <div class="text-h6">By Date Assigned</div>
          </q-card-section>
          <q-card-section>
            <bar-chart :data="groupedByDate" />
          </q-card-section> 
        </q-card>
      </div>
    </div>
    
  </q-page>
</template>

<script>
import * as _ from 'underscore'

export default {
  // name: 'PageName',
  data() {
  	return {
      filterDialog: true
  	}
  },
  computed: {
    documents() {
      return this.$store.state.document.documents
    },
  	groupedAssignments() {
  		const assignments = this.$store.getters['assignment/ongoing']

  		return _.countBy(assignments, 'assignedTo')
  	},
    groupedByDate() {
      const assignments = this.$store.getters['assignment/ongoing']

      const grouped = _.countBy(assignments, ['dateAssigned'])

      return grouped
    },

  }
}
</script>
