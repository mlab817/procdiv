<template>
  <q-page padding>
    <div class="row justify-end q-mb-md">
      <q-input outlined placeholder="Search assignments..." dense class="q-mr-sm" v-model="searchField">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>

      <q-btn icon="filter_list" :label="$q.screen.gt.sm ? 'Filter': void 0" color="positive" disabled></q-btn>
    </div>

    <q-toolbar class="bg-positive text-white q-mt-md text-center">
      <q-toolbar-title>
        Completed
      </q-toolbar-title>
    </q-toolbar>

    <q-markup-table square flat bordered wrap-cells>
      <thead>
        <tr>
          <th>Document</th>
          <th>Particulars</th>
          <th>Enduser</th>
          <th>Reference No.</th>
          <th>Action Taken</th>
          <th>Assigned To</th>
          <th>Remarks</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="Object.keys(completed).length">
          <tr v-for="(assignment, key) in completed" :key="key">
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
            <td>{{assignment.dateCompleted}}</td>
            <td class="text-center items-center q-gutter-sm">
              <q-btn outlined dense icon="undo" color="negative" @click="undoCompleted(assignment)"></q-btn>
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
import { date } from 'quasar'

export default {
  name: 'PageCompleted',

  computed: {

    completed() {
      return this.$store.getters['assignment/completed']
    },

    searchField: {
      get() {
        return this.$store.state.assignment.search
      },
      set(val) {
        this.$store.dispatch('assignment/setSearch', val)
      }
    }

  },

  data() {
    return {
    	//
    }
  },

  methods: {
    markAsCompleted(assignment) {
      this.$store.dispatch('assignment/markAsCompleted', assignment.id)
    },

    undoCompleted(assignment) {
      this.$q.dialog({
        title: 'Undo Completed',
        message: 'Undo completed',
        cancel: true
      })
      .onOk(() => this.$store.dispatch('assignment/undoMarkAsCompleted', assignment.id))
    },

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
        const formatDate = date.formatDate(val, 'MMM D, YYYY')
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
    }
  },

  created() {
    this.$store.dispatch('assignment/fbReadData')
  }
}
</script>
