<template>
  <q-page padding>
  	<div class="row q-my-sm" v-if="$q.screen.lt.md">
  		<search class="col" />
  	</div>

    <div class="row justify-end q-mb-md">
      <div class="row">
        <download-excel :data="completedArray">
          <q-btn icon="archive" label="Download" color="secondary" />
        </download-excel>
      	<sort class="q-ml-sm" />
      	<search class="q-ml-sm" v-if="$q.screen.gt.sm" />
      </div>
    </div>

    <q-toolbar class="bg-positive text-white q-mt-md text-center">
      <q-toolbar-title>
        Completed
      </q-toolbar-title>
    </q-toolbar>

    <q-markup-table square flat bordered wrap-cells>
      <thead>
        <tr>
          <th>Date Assigned</th>
          <th>Document</th>
          <th>Particulars</th>
          <th>Enduser</th>
          <th>Reference No.</th>
          <th>Action Taken</th>
          <th>Assigned To</th>
          <th>Remarks</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th v-if="role ==='admin'">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="Object.keys(completed).length">
          <tr v-for="(assignment, key) in completed" :key="key">
            <td>{{assignment.dateAssigned | showDate }}</td>
            <td>{{assignment.document}}</td>
            <td>{{assignment.particulars}}</td>
            <td>{{assignment.enduser}}</td>
            <td>{{assignment.referenceNo}}</td>
            <td>{{assignment.actionTaken}}</td>
            <td>{{assignment.assignedTo}}</td>
            <td>{{assignment.remarks}}</td>
            <td class="text-right">
              <div class="row justify-end items-center">
                {{assignment.dueDate}}    
                <q-icon name="event" class="text-grey-8" v-if="assignment.dueDate"></q-icon>
              </div>
              <div class="row justify-end items-center">
                {{assignment.dueTime}}  
                <q-icon name="alarm" class="text-grey-8" v-if="assignment.dueTime"></q-icon>  
              </div>
            </td>
            <td>{{ assignment.dateCompleted | formattedDate }}</td>
            <td class="text-center items-center q-gutter-sm" v-if="role ==='admin'">
              <q-btn outlined dense icon="undo" color="negative" @click="undoCompleted(key)"></q-btn>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="text-center text-negative" colspan="10">No completed assignment.</td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
    
  </q-page>
</template>

<script>
import { parseDate } from 'src/functions'
import { date } from 'quasar'

export default {
  name: 'PageCompleted',

  components: {
  	'sort': () => import('../../components/shared/Sort.vue'),
  	'search': () => import('../../components/shared/Search.vue'),
  },

  computed: {
    role() {
      return this.$store.getters['auth/role']
    },

    completed() {
      return this.$store.getters['assignment/completed']
    },

    searchField() {
     	return this.$store.state.assignment.search
    },

    completedArray() {
      let arr = []

      Object.keys(this.completed).forEach(key => {
        const ass = this.completed[key]

        arr.push(ass)
      })

      const completedArray = arr.map(a => {
        console.log(typeof a.dateCompleted, a.dateCompleted)
        return {
          'Date Assigned': a.dateAssigned ? date.formatDate(parseDate(a.dateAssigned), 'MMM DD, YYYY hh:mm A') : '',
          'Document': a.document,
          'Particulars': a.particulars,
          'RFQ Deadline': a.rfqDeadline,
          'Enduser': a.enduser,
          'Reference No.': a.referenceNo,
          'Action Taken': a.actionTaken,
          'Assigned To': a.assignedTo,
          'Remarks': a.remarks,
          'Due Date/Time': a.dateDue ? date.formatDate(parseDate(a.dateDue), 'MMM DD, YYYY hh:mm A') : '',
          'Date Completed': typeof a.dateCompleted === 'number' ? date.formatDate(a.dateCompleted / 1000, 'MMM DD, YYYY hh:mm A') : date.formatDate(parseDate(a.dateCompleted), 'MMM DD, YYYY hh:mm A'),
          'Status': a.status
        }
      })

      return completedArray
    }

  },

  data() {
    return {
    	//
    }
  },

  methods: {
    undoCompleted(id) {
      this.$q.dialog({
        title: 'Undo Completed',
        message: 'Undo completed',
        cancel: true
      })
      .onOk(() => this.$store.dispatch('assignment/undoMarkAsCompleted', id))
    }
  },

  filters: {
    searchHighlight(value, search) {
      if (search) {
        let searchRegExp = new RegExp(search, 'ig')
        return value && value.replace(searchRegExp, (match) => {
          return '<span class="bg-yellow-6">' + match + '</span>'
        })
      }
      return value
    },

    showDate(val) {
      if (val) {
        const srcDate = new Date(val)
        const formatDate = date.formatDate(srcDate, 'MMM D, YYYY')
        return formatDate
      }
      return ''
    },

    showTime(val) {
      if (val) {
        const formatTime = date.formatDate(val, 'hh:mm A')
        return formatTime
      }
      return ''
    },

    formattedDate(val) {
      if (val) {
        return (typeof val === 'number') ? date.formatDate(val, 'MMM DD, YYYY hh:mm A') : date.formatDate(parseDate(val), 'MMM DD, YYYY hh:mm A')
      }
      return ''
      
    } 
  }
}
</script>
