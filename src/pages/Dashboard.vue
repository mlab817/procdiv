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

    <div class="row q-py-md q-gutter-md">
      <q-btn label="Seed Endusers" @click="seedEndusers"></q-btn>

      <q-btn label="Seed Documents" @click="seedDocuments"></q-btn>

      <q-btn label="Seed Staff" @click="seedStaff"></q-btn>

      <q-btn label="Seed Assignments" @click="seedAssignments"></q-btn>
    </div>
    
  </q-page>
</template>

<script>
import * as _ from 'underscore'
import { SEED } from '../seeds'
import { firebaseFs } from 'boot/firebase'
import { parseDate } from 'src/functions/parse-date'
import { date } from 'quasar'

export default {
  // name: 'PageName',
  data() {
  	return {
      filterDialog: true,
      seed: SEED
  	}
  },
  computed: {
    // documents() {
    //   return this.$store.state.document.documents
    // },
  	groupedAssignments() {
  		const assignments = this.$store.getters['assignment/ongoing']

  		return _.countBy(assignments, 'assignedTo')
  	},
    groupedByDate() {
      const assignments = this.$store.getters['assignment/ongoing']
      let recoded = []

      Object.keys(assignments).forEach(key => {
        const assignment = assignments[key]
        recoded.push({
          ...assignment,
          dateAssigned: date.formatDate(parseDate(assignment.dateAssigned),'YYYY-MM-DD')
        })
      })

      const grouped = _.countBy(recoded, ['dateAssigned'])

      return grouped
    },

  },
  methods: {
    seedEndusers() {
      const endusers = this.seed.endusers

      Object.keys(this.endusers).forEach(key => {
        const ref = firebaseFs.collection('endusers').doc()
        const enduser = endusers[key]

        ref.set(enduser)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedDocuments() {
      const documents = this.seed.documents
      Object.keys(documents).forEach(key => {
        const ref = firebaseFs.collection('documents').doc()
        const doc = documents[key]

        ref.set(doc)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedStaff() {
      const staffs = this.seed.staff
      Object.keys(staffs).forEach(key => {
        const ref = firebaseFs.collection('staff').doc()
        const staff = staffs[key]

        ref.set(staff)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedAssignments() {
      const assignments = this.seed.assignments
      Object.keys(this.seed.assignments).forEach(key => {
        const ref = firebaseFs.collection('assignments').doc()
        const ass = assignments
        ass.status = ass.completed ? 'completed' : 'ongoing'

        ref.set(ass)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    }
  }
}
</script>
