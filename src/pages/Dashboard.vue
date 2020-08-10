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
import { ENDUSERS } from '../seeds/endusers'
import { DOCUMENTS } from '../seeds/documents'
import { STAFF } from '../seeds/staff'
import { ASSIGNMENTS } from '../seeds/assignments'
import { firebaseFs } from 'boot/firebase'

export default {
  // name: 'PageName',
  data() {
  	return {
      filterDialog: true,
      endusers: ENDUSERS,
      documents: DOCUMENTS,
      staff: STAFF,
      assignments: ASSIGNMENTS
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

      const grouped = _.countBy(assignments, ['dateAssigned'])

      return grouped
    },

  },
  methods: {
    seedEndusers() {
      Object.keys(this.endusers).forEach(key => {
        const ref = firebaseFs.collection('endusers').doc()
        const enduser = this.endusers[key]
        const payload = {
          id: key, 
          enduser: enduser
        }
        ref.set(enduser)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedDocuments() {
      Object.keys(this.documents).forEach(key => {
        const ref = firebaseFs.collection('documents').doc()
        const doc = this.documents[key]

        ref.set(doc)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedStaff() {
      Object.keys(this.staff).forEach(key => {
        const ref = firebaseFs.collection('staff').doc()
        const staff = this.staff[key]

        ref.set(staff)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    },
    seedAssignments() {

    }
  }
}
</script>
