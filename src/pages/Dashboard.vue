<template>
  <q-page padding>
    <q-banner class="bg-grey-3 q-mb-md" v-if="!linked">
      <template v-slot:avatar>
        <q-icon name="link_off" color="red" />
      </template>
      You are not connected to any staff. You will not be able to view records in the application until then. Please wait or notify the admin.
    </q-banner>

    <div class="row q-col-gutter-md">
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <zingchart :data="pieConfig" />
      </div>
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <zingchart :data="byStatus" />
      </div>
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <zingchart :data="byDateDue" />
      </div>
      <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
        <q-list>
          <q-item-label header>Overdue Tasks</q-item-label>
          <template v-for="(task, key) in overdue">
            <q-item :key="key" clickable tag="a" :to="`/tasks/${key}`">
              <q-item-section avatar>
                <q-avatar class="bg-primary text-white">{{task.assignedName.charAt(0)}}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{task.document}} - <strong>{{task.referenceNo}}</strong></q-item-label>
                <q-item-label caption>{{task.assignedName}}</q-item-label>
              </q-item-section>
              <q-item-section top side>
                <q-item-label>{{task.dateDue | getDate }}</q-item-label>
                <q-item-label>{{task.dateDue | getTime }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-item clickable>
            <q-item-section>
              <q-item-label class="text-right">
                View More
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- <q-toolbar>
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
    </div> -->

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
      chartConfig: {
        theme: 'classic',
        backgroundColor: '#111',
        graphset: [
          {
            type: 'null',
            backgroundColor: 'none',
            width: '100%',
            height: '100%',
            x: '0px',
            y: '0px',
            widgets: [
              {
                type: 'dashboard_datetime',
                id: 'dash1',
                backgroundColor1: '#55154D',
                backgroundColor2: '#44043C',
                title: 'NEW YORK',
                width: '230px',
                height: '230px',
                x: '10px',
                y: '13px',
              },
              {
                type: 'dashboard_metric',
                id: 'dash2',
                value: 813.74,
                backgroundColor1: '#67001F',
                backgroundColor2: '#56000E',
                percent: +11.52,
                title: 'VIRAL COEFFICIENT',
                width: '230px',
                height: '230px',
                x: '248px',
                y: '13px',
              },
              {
                type: 'dashboard_accounts',
                id: 'dash3',
                width: '230px',
                height: '230px',
                x: '486px',
                y: '13px',
              },
              {
                type: 'dashboard_metric',
                id: 'dash4',
                value: 83.18,
                backgroundColor1: '#014358',
                backgroundColor2: '#003247',
                percent: -21.27,
                title: 'RETENTION RATE (30 DAYS)',
                width: '230px',
                height: '230px',
                x: '10px',
                y: '255px',
              },
              {
                type: 'dashboard_metric',
                id: 'dash5',
                value: '487.32',
                backgroundColor1: '#264031',
                backgroundColor2: '#22392b',
                percent: 4.37,
                title: 'AVG TIME ON SITE',
                width: '468px',
                height: '230px',
                x: '248px',
                y: '255px',
              }
            ]
          }
        ]
      }
  	}
  },
  computed: {
    linked() {
      return this.$store.getters['auth/linked']
    },
  	groupedAssignments() {
  		const assignments = this.$store.getters['assignment/ongoing']

  		return _.countBy(assignments, 'assignedTo')
  	},
    pieConfig() {
      const tasks = this.$store.state.task.tasks
      let groupedTask = []
      let pieConfig = {}

      const countTasks = _.countBy(tasks, 'assignedName')

      Object.keys(countTasks).forEach(key => {
        let values = []
        values.push(countTasks[key])
        groupedTask.push({
          text: key,
          values: values
        })
      })

      pieConfig.type = 'pie'
      pieConfig.backgroundColor = '#2B313B'
      pieConfig.title = {
        text: 'Tasks by Staff',
        align: 'left',
        fontColor: '#fff',
        fontFamily: 'Open Sans',
        fontSize: '25px',
        offsetX: '10px',
      }
      pieConfig.plot = {
        tooltip: {
          text: '%npv%',
          padding: '5 10',
          fontFamily: 'Open Sans',
          fontSize: '18px'
        },
        valueBox: {
          text: '%t\n%npv%',
          fontFamily: 'Open Sans',
          placement: 'out'
        },
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_REGULAR_EASE_OUT',
          sequence: 'ANIMATION_BY_PLOT',
          speed: 500
        },
        borderColor: '#2B313B',
        borderWidth: '5px'
      }
      pieConfig.series = groupedTask

      return pieConfig
    },
    byDateDue() {
      const tasks = Object.assign({}, this.$store.state.task.tasks)
      let groupedTask = []
      let pieConfig = {}
      let newTasks = {}

      Object.keys(tasks).forEach(key => {
        const task = tasks[key]
        task.dueDate = date.formatDate(task.dateDue, 'MMM DD, YYYY') || ''

        newTasks[key] = task
      })

      const countTasks = _.countBy(newTasks,'dueDate')

      Object.keys(countTasks).forEach(key => {
        let values = []
        values.push(countTasks[key])
        groupedTask.push({
          text: key,
          values: values
        })
      })

      pieConfig.type = 'pie'
      pieConfig.backgroundColor = '#2B313B'
      pieConfig.title = {
        text: 'Tasks by Due Date',
        align: 'left',
        fontColor: '#fff',
        fontFamily: 'Open Sans',
        fontSize: '25px',
        offsetX: '10px',
      }
      pieConfig.plot = {
        tooltip: {
          text: '%npv%',
          padding: '5 10',
          fontFamily: 'Open Sans',
          fontSize: '18px'
        },
        valueBox: {
          text: '%t\n%npv%',
          fontFamily: 'Open Sans',
          placement: 'out'
        },
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_REGULAR_EASE_OUT',
          sequence: 'ANIMATION_BY_PLOT',
          speed: 500
        },
        borderColor: '#2B313B',
        borderWidth: '5px'
      }
      pieConfig.series = groupedTask

      return pieConfig
    },
    byStatus() {
      const tasks = this.$store.state.task.tasks
      let groupedTask = []
      let pieConfig = {}

      const countTasks = _.countBy(tasks, 'status')

      Object.keys(countTasks).forEach(key => {
        let values = []
        values.push(countTasks[key])
        groupedTask.push({
          text: key.toUpperCase(),
          values: values
        })
      })

      pieConfig.type = 'pie'
      pieConfig.backgroundColor = '#2B313B'
      pieConfig.title = {
        text: 'Tasks by Status',
        align: 'left',
        fontColor: '#fff',
        fontFamily: 'Open Sans',
        fontSize: '25px',
        offsetX: '10px',
      }
      pieConfig.plot = {
        tooltip: {
          text: '%npv%',
          padding: '5 10',
          fontFamily: 'Open Sans',
          fontSize: '18px'
        },
        valueBox: {
          text: '%t\n%npv%',
          fontFamily: 'Open Sans',
          placement: 'out'
        },
        animation: {
          effect: 'ANIMATION_EXPAND_VERTICAL',
          method: 'ANIMATION_REGULAR_EASE_OUT',
          sequence: 'ANIMATION_BY_PLOT',
          speed: 500
        },
        borderColor: '#2B313B',
        borderWidth: '5px'
      }
      pieConfig.series = groupedTask

      return pieConfig

    },
    groupedByDate() {
      const assignments = this.$store.getters['assignment/ongoing']
      let recoded = []

      Object.keys(assignments).forEach(key => {
        const assignment = assignments[key]

        const dateAssigned = date.formatDate(assignment.dateAssigned,'YYYY-MM-DD')
        recoded.push({
          ...assignment,
          dateAssigned
        })
      })

      const grouped = _.countBy(recoded, ['dateAssigned'])

      return grouped
    },
    ongoing() {
      return this.$store.getters['task/ongoing']
    },
    overdue() {
      return this.$store.getters['task/overdue']
    }
  },
  methods: {
    seedEndusers() {
      const endusers = this.seed.endusers

      Object.keys(endusers).forEach(key => {
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

      Object.keys(assignments).forEach(key => {
        const ref = firebaseFs.collection('assignments').doc()
        const assignment = assignments[key]
        
        assignment.status = (assignment.completed) ? 'completed' : 'ongoing'

        ref.set(assignment)
          .then(() => console.log('success'))
          .catch(err => console.error(err))
      })
    }
  },
  filters: {
    getDate(val) {
      return date.formatDate(val,'MMM DD (ddd)')
    },
    getTime(val) {
      return date.formatDate(val,'hh:mm A')
    }
  }
}
</script>
