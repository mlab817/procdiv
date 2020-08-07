<template>
  <q-page padding>
    <div class="row justify-end q-mb-md">
      <q-input outlined placeholder="Search assignments..." dense class="q-mr-sm" v-model="searchField">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>

      <q-btn icon="filter_list" :label="$q.screen.gt.sm ? 'Filter': void 0" class="q-mr-sm" color="positive" disabled></q-btn>

      <q-btn icon="add" :label="$q.screen.gt.sm ? 'New': void 0" color="primary" v-ripple @click="showAddAssignment"></q-btn>
    </div>
    
    <q-dialog v-model="addAssignmentDialog" full-width persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row justify-between">
            <div class="text-h6">
              {{toolbarTitle}}
            </div>
            <q-space/>
            <q-btn icon="close" v-close-popup flat round dense></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-form greedy class="q-gutter-sm">
            <q-input v-model="document" outlined label="Document" stack-label></q-input>
            <q-input v-model="particulars" outlined label="Particulars" stack-label></q-input>
            <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
              <q-select v-model="enduser" use-input @filter="filterEndusers" :options="enduserOptions" outlined label="Enduser" stack-label class="col" emit-value map-options></q-select>
              <div>
                <q-btn flat round icon="edit" @click="addEnduser" color="primary"></q-btn>
              </div>
            </div>
            <q-input v-model="referenceNo" outlined label="Reference No" stack-label></q-input>
            <q-input v-model="actionTaken" outlined label="Action Taken" stack-label></q-input>
            <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
              <q-select v-model="assignedTo" :options="staff" outlined label="Assigned To" stack-label class="col" emit-value map-options></q-select>
              <div>
                <q-btn flat round icon="edit" @click="addStaff" color="primary"></q-btn>
              </div>
            </div>
            <q-input v-model="remarks" outlined label="Remarks" stack-label></q-input>
            <q-input v-model="dateDue" outlined label="Due Date/Time" stack-label>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="dateDue" mask="YYYY-MM-DD hh:mm A" />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="dateDue" mask="YYYY-MM-DD hh:mm A" format12h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup></q-btn>
          <q-btn unelevated label="OK" color="primary" @click="handleSubmit"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-toolbar class="bg-primary text-white text-center">
      <q-toolbar-title>
        Ongoing
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
          <th>Due Date/Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="Object.keys(ongoing).length">
          <tr v-for="(assignment, key) in ongoing" :key="key" :class="overdue(assignment) ? 'bg-red-2': ''">
            <td>{{assignment.dateAssigned | showDate }}</td>
            <td v-html="$options.filters.searchHighlight(assignment.document, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.particulars, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.enduser, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.referenceNo, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.actionTaken, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.assignedTo, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.remarks, searchField)"></td>
            <td class="text-right">
              <div class="row justify-end items-center">
                {{assignment.dateDue | showDate }}    
                <q-icon name="event" class="text-grey-8" v-if="assignment.dateDue"></q-icon>
              </div>
              <div class="row justify-end items-center">
                {{assignment.dateDue | showTime }}  
                <q-icon name="alarm" class="text-grey-8" v-if="assignment.dateDue"></q-icon>  
              </div>
            </td>
            <td class="text-center items-center q-gutter-sm">
              <q-btn outlined dense icon="done_outline" color="positive" @click="confirmCompleted(assignment)"></q-btn>
              <q-btn outlined dense icon="edit" color="primary" @click="editAssignment(assignment)"></q-btn>
              <q-btn outlined dense icon="delete" color="negative" @click="confirmDelete(assignment)"></q-btn>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="text-center text-negative" colspan="10">No ongoing assignment.</td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>

    <template v-if="Object.keys(completed).length">
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
    </template>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
    
  </q-page>
</template>

<script>
import { uid, date } from 'quasar'

export default {
  name: 'PageIndex',

  computed: {
    ongoing() {
      // return this.$store.state.assignment.assignments
      // 
      return this.$store.getters['assignment/ongoing']
    },

    completed() {
      return this.$store.getters['assignment/completed']
    },

    filtered() {
      return this.$store.getters['assignment/filtered']
    },

    searchField: {
      get() {
        return this.$store.state.assignment.search
      },
      set(val) {
        this.$store.dispatch('assignment/setSearch', val)
      }
    },

    staff() {
      return this.$store.state.staff.staff
    },

    endusers() {
      return this.$store.state.enduser.endusers
    }
  },

  data() {
    return {
      addAssignmentDialog: false,
      document: '',
      particulars: '',
      enduser: '',
      referenceNo: '',
      actionTaken: '',
      assignedTo: '',
      remarks: '',
      dateDue: '',
      id: '',
      enduserOptions: [],
      toolbarTitle: 'Add Assignment'
    }
  },

  methods: {
    filterEndusers(val, update) {
      if (val === '') {
        update(() => {
          this.enduserOptions = this.endusers
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.enduserOptions = this.endusers.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })

    },

    showAddAssignment() {
      this.toolbarTitle = 'Add Assignment'
      this.id = ''
      this.document = ''
      this.particulars = ''
      this.enduser = ''
      this.referenceNo = ''
      this.actionTaken = ''
      this.assignedTo = ''
      this.remarks = ''
      this.dateDue = ''

      this.addAssignmentDialog = true
    },

    addAssignment() {      
      const now = Date.now()

      const payload = {
        document: this.document,
        particulars: this.particulars,
        enduser: this.enduser,
        referenceNo: this.referenceNo,
        actionTaken: this.actionTaken,
        assignedTo: this.assignedTo,
        remarks: this.remarks,
        dateDue: this.dateDue,
        dateAssigned: date.formatDate(now, 'YYYY-MM-DD hh:mm A')
      }

      this.$store.dispatch('assignment/add', payload)

      this.addAssignmentDialog = false
    },

    handleSubmit() {
      const id = this.id

      if (!id) {
        this.addAssignment()
      } else {
        this.updateAssignment()
      }
    },

    editAssignment(assignment) {
      this.toolbarTitle = 'Edit Assignment'

      this.id = assignment.id
      this.document = assignment.document
      this.particulars = assignment.particulars
      this.enduser = assignment.enduser
      this.referenceNo = assignment.referenceNo
      this.actionTaken = assignment.actionTaken
      this.assignedTo = assignment.assignedTo
      this.remarks = assignment.remarks
      this.dateDue = assignment.dateDue
      this.dateAssigned = assignment.dateAssigned

      this.addAssignmentDialog = true
    },

    updateAssignment() {
      const payload = {
        id: this.id,
        updates: {
          document: this.document,
          particulars: this.particulars,
          enduser: this.enduser,
          referenceNo: this.referenceNo,
          actionTaken: this.actionTaken,
          assignedTo: this.assignedTo,
          remarks: this.remarks,
          dateDue: this.dateDue,
          dateAssigned: this.dateAssigned
        }   
      }

      this.$store.dispatch('assignment/update', payload)

      this.addAssignmentDialog = false

    },

    confirmDelete(assignment) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this assignment?',
        cancel: true
      })
      .onOk(() => this.$store.dispatch('assignment/deleteAssignment', assignment.id))
    },

    confirmCompleted(assignment) {
      this.$q.dialog({
        title: 'Confirm Completed',
        message: 'Mark the assignment as completed',
        cancel: true
      })
      .onOk(() => this.markAsCompleted(assignment))
    },

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

    addStaff() {
      this.$q.dialog({
        title: 'Add Staff',
        prompt: {
          model: '',
          type: 'text',
          isValid: val => !!val
        },
        cancel: true
      })
      .onOk(data => this.$store.dispatch('staff/add', data))
    },

    addEnduser() {
      this.$q.dialog({
        title: 'Add Enduser',
        prompt: {
          model: '',
          type: 'text',
          isValid: val => !!val
        },
        cancel: true
      })
      .onOk(data => this.$store.dispatch('enduser/add', data))
    },

    overdue(assignment) {
      const now = Date.now()
      const dateDue = assignment.dateDue

      const diff = date.getDateDiff(dateDue, now, 'seconds')

      return diff < 0
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
