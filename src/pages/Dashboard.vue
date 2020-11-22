<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <q-toolbar>
      <q-toolbar-title>Dashboard</q-toolbar-title>
    </q-toolbar>

		<overview></overview>

		<div class="row">
			<todo-list></todo-list>
		</div>

    <q-banner class="bg-grey-3 q-mb-md" v-if="loggedIn && !linked">
      <template v-slot:avatar>
        <q-icon name="link_off" color="red" />
      </template>
      You are not connected to any staff. You will not be able to view records in the application until then. Please wait or notify the admin.
    </q-banner>

    <div class="row">
      <div class="col-xl-8 col-lg-8 col-md-6 col-sm-12 col-xs-12">
        <div class="row">
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <zing-chart type="pie" title="Tasks by Staff" :entries="tasks" groupBy="assignedName" legend></zing-chart>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <zing-chart type="pie" title="Tasks by Status" :entries="tasks" groupBy="status" legend></zing-chart>
          </div>
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <calendar-chart title="Tasks by Date Assigned" :entries="entries" groupBy="dateAssigned" />
          </div>
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <calendar-chart title="Task By Due Date" :entries="entries" groupBy="dateDue" />
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <q-list>
          <q-item-label header>Overdue Tasks</q-item-label>
          <template v-for="(task, index) in overdue">
            <q-item :key="index" clickable tag="a" :to="`/tasks/${task.id}`">
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
          <q-item clickable to="/overdue">
            <q-item-section>
              <q-item-label>View More</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

  </q-page>
</template>

<script>
import * as _ from 'underscore'
import { SEED } from '../seeds'
import { firebaseFs } from 'boot/firebase'
import { parseDate } from 'src/functions/parse-date'
import { date } from 'quasar'
import { objectToArray } from 'src/utils'
import Overview from '../components/dashboard/Overview'
import TodoList from '../components/dashboard/TodoList'

export default {
	components: {TodoList, Overview},
	// name: 'PageName',
  data() {
  	return {
      filterDialog: true,
      filterTasksDialog: true,
      statuses: [
        {
          value: 'ongoing',
          label: 'Ongoing'
        },
				{
          value: 'completed',
          label: 'Completed'
        },
				{
          value: 'deleted',
          label: 'Deleted'
        }
      ],
      filter: {
        statuses: []
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn
    },
    tasks() {
      return this.$store.state.task.tasks
    },
    linked() {
      return this.$store.getters['auth/linked']
    },
  	groupedAssignments() {
  		const assignments = this.$store.getters['assignment/ongoing']

  		return _.countBy(assignments, 'assignedTo')
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
      const overdueTasks = this.$store.getters['task/overdue']

      return Object.keys(overdueTasks).map(key => {
        return {
          ...overdueTasks[key],
          id: key
        }
      }).slice(0, 5)
    },
    entries() {
      const tasks = this.tasks

      return objectToArray(tasks)
    }
  },
  methods: {
    initMap() {
      //
    }
  },
  filters: {
    getDate(val) {
      return date.formatDate(val,'MMM DD (ddd)')
    },
    getTime(val) {
      return date.formatDate(val,'hh:mm A')
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>
