<template>
  <q-page padding>
    <q-banner class="bg-red-1 q-mb-md">
      <template v-slot:avatar>
        <q-icon name="warning" color="negative" />
      </template>
      <p class="text-weight-bold text-h6">Deprecation Notice </p>
      <p><strong>Assignments</strong> have been replaced by <strong>Tasks</strong>. This feature will only be available until all assignments have been completed.</p>
      <template v-slot:action>
        <q-btn flat color="negative" label="Go to Tasks" to="/ongoing" />
      </template>
    </q-banner>

  	<div class="row q-my-sm" v-if="$q.screen.lt.md">
  		<search class="col" />
  	</div>

    <div class="row justify-between q-mb-sm">
    	<div class="row items-stretch">
    		<q-btn disabled class="q-mr-sm" icon="add" :label="$q.screen.gt.sm ? 'New': void 0" color="primary" v-ripple @click="showAddAssignment" v-if="role === 'admin'">
          <q-tooltip>Add new assignment</q-tooltip>  
        </q-btn>
        
        <download-excel :data="ongoingArray">
          <q-btn icon="get_app" :label="$q.screen.gt.sm ? 'Download': void 0" class="btn-download" color="secondary">
            <q-tooltip>Download ongoing assignments</q-tooltip>
          </q-btn>
        </download-excel>
    	</div>	

    	<div class="row">
	      <sort />

        <filter-date class="q-ml-sm" />

	      <search class="q-ml-sm" v-if="$q.screen.gt.sm"/>
      </div>

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
            <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
              <q-select v-model="document" :options="documents" outlined label="Document" stack-label class="col" emit-value map-options />
              <div>
                <q-btn flat round icon="edit" @click="addDocument" color="primary"></q-btn>
              </div>
            </div>

            <q-input v-model="particulars" outlined label="Particulars" stack-label></q-input>

            <q-input v-model="rfqDeadline" outlined label="RFQ Deadline" stack-label clearable>

              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="rfqDeadline" mask="YYYY-MM-DD hh:mm A" />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="rfqDeadline" mask="YYYY-MM-DD hh:mm A" format12h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
              <q-select v-model="enduser" use-input @filter="filterEndusers" :options="enduserOptions" outlined label="Enduser" stack-label class="col" emit-value map-options></q-select>
              <div>
                <q-btn flat round icon="edit" @click="addEnduserDialog = true" color="primary"></q-btn>
              </div>
            </div>

            <q-input v-model="referenceNo" outlined label="Reference No" stack-label></q-input>

            <q-input v-model="actionTaken" outlined label="Action Taken" stack-label></q-input>

            <div class="row items-center q-pt-sm q-pl-sm q-col-gutter-sm">
              <q-select v-model="assignedTo" :options="staff" outlined label="Assigned To" stack-label class="col" option-label="displayName" option-value="id"></q-select>
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

    <q-dialog v-model="addEnduserDialog" persistent>
      <q-card style="min-width: 400px;">
        <q-card-section class="row justify-between">
          <div class="text-h6">Add Enduser</div>
          <q-space/>
          <q-btn flat round dense v-close-popup icon="close"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="newEnduser.label" label="Label" stack-label outlined />
            <q-input v-model="newEnduser.value" label="Value" stack-label outlined />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup></q-btn>
          <q-btn flat label="OK" color="primary" :disabled="!newEnduser.label || !newEnduser.value" @click="addEnduser"></q-btn>
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
          <th>RFQ Deadline</th>
          <th>Due Date/Time</th>
          <th v-if="role === 'admin'">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="Object.keys(ongoing).length">
          <tr v-for="(assignment, key) in ongoing" :key="key" :class="overdue(assignment) ? 'bg-red-2': ''">
            <td>
              <q-item-label>
                {{assignment.dateAssigned | showDate }}
              </q-item-label>
              <q-item-label caption>
                {{assignment.dateAssigned | showTime }}
              </q-item-label>
            </td>
            <td class="text-center cursor-pointer" v-html="$options.filters.searchHighlight(assignment.document, searchField)" @click="setSearch(assignment.document)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.particulars, searchField)"></td>
            <td class="text-center cursor-pointer" v-html="$options.filters.searchHighlight(assignment.enduser, searchField)" @click="setSearch(assignment.enduser)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.referenceNo, searchField)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.actionTaken, searchField)"></td>
            <td class="text-center cursor-pointer" v-html="$options.filters.searchHighlight(assignment.assignedTo, searchField)" @click="setSearch(assignment.assignedTo)"></td>
            <td class="text-center" v-html="$options.filters.searchHighlight(assignment.remarks, searchField)"></td>
            <td class="text-right">
              <div class="row justify-end items-center no-wrap" v-if="assignment.rfqDeadline">
                {{assignment.rfqDeadline | showDate}}    
                <q-icon name="event" class="text-grey-8" v-if="assignment.dateDue"></q-icon>
              </div>
              <div class="row justify-end items-center no-wrap" v-if="assignment.rfqDeadline">
                {{assignment.rfqDeadline | showTime}}  
                <q-icon name="alarm" class="text-grey-8" v-if="assignment.dateDue"></q-icon>  
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-end items-center no-wrap">
                {{assignment.dateDue | showDate}}    
                <q-icon name="event" class="text-grey-8" v-if="assignment.dateDue"></q-icon>
              </div>
              <div class="row justify-end items-center no-wrap">
                {{assignment.dateDue | showTime}}  
                <q-icon name="alarm" class="text-grey-8" v-if="assignment.dateDue"></q-icon>  
              </div>
            </td>
            <td class="text-center items-center" v-if="role === 'admin'">
              <div class="row justify-center q-gutter-sm no-wrap">
                <q-btn 
                  outlined 
                  dense 
                  icon="done_outline" 
                  color="positive" 
                  @click="confirmCompleted(assignment, key)" />
                <q-btn 
                  outlined 
                  dense 
                  icon="edit" 
                  color="primary" 
                  @click="editAssignment(assignment, key)" />
                <q-btn 
                  outlined 
                  dense 
                  icon="delete" 
                  color="negative" 
                  @click="confirmDelete(key)" />
              </div>
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

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
    
  </q-page>
</template>

<script>
import { uid, date } from 'quasar'
import { parseDate } from 'src/functions/parse-date'

export default {
  name: 'PageIndex',

  components: {
  	'sort': () => import('../../components/shared/Sort.vue'),
  	'search': () => import('../../components/shared/Search.vue'),
    'filter-date': () => import('../../components/shared/FilterDate.vue')
  },

  computed: {
    role() {
      return this.$store.getters['auth/role']
    },

    ongoing() {
      return this.$store.getters['assignment/ongoing']
    },

    staff() {
      // return this.$store.state.staff.staff
      // return this.$store.getters['staff/options']
      return this.$store.getters['user/options']
    },

    endusers() {
      return this.$store.getters['enduser/options']
    },

    documents() {
      return this.$store.getters['document/options']
    },

    searchField() {
      return this.$store.state.assignment.search
    },

    ongoingArray() {
      let arr = []

      Object.keys(this.ongoing).forEach(key => {
        const ass = this.ongoing[key]

        arr.push(ass)
      })

      const newArr = arr.map(a => {
        return {
          'Date Assigned': date.formatDate(parseDate(a.dateAssigned), 'MMM DD, YYYY hh:mm A'),
          'Document': a.document,
          'Particulars': a.particulars,
          'RFQ Deadline': a.rfqDeadline,
          'Enduser': a.enduser,
          'Reference No.': a.referenceNo,
          'Action Taken': a.actionTaken,
          'Assigned To': a.assignedTo,
          'Remarks': a.remarks,
          'Due Date/Time': date.formatDate(parseDate(a.dateDue), 'MMM DD, YYYY hh:mm A'),
          'Date Completed': date.formatDate(parseDate(a.dateCompleted), 'MMM DD, YYYY hh:mm A')
        }
      })

      return newArr
    }
  },

  data() {
    return {
      addAssignmentDialog: false,
      document: '',
      rfqDeadline: '',
      particulars: '',
      enduser: '',
      referenceNo: '',
      actionTaken: '',
      assignedTo: '',
      remarks: '',
      dateDue: '',
      id: '',
      toolbarTitle: 'Add Assignment',
      addEnduserDialog: false,
      enduserOptions: [],
      newEnduser: {
        label: '',
        value: ''
      }
    }
  },

  methods: {
    parseDate,

    setSearch(search) {
      this.$store.dispatch('assignment/setSearch', search)
    },

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
      this.rfqDeadline = date.formatDate(new Date(), 'YYYY-MM-DD') + ' 12:00 PM'
      this.particulars = ''
      this.rfqDeadline = date.formatDate(Date.now(), 'YYYY-MM-DD') + ' 12:00 PM'
      this.enduser = ''
      this.referenceNo = ''
      this.actionTaken = ''
      this.assignedTo = ''
      this.remarks = ''
      this.dateDue = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')

      this.addAssignmentDialog = true
    },

    addAssignment() {      
      const payload = {
        document: this.document,
        rfqDeadline: this.rfqDeadline,
        particulars: this.particulars,
        rfqDeadline: this.rfqDeadline,
        enduser: this.enduser,
        referenceNo: this.referenceNo,
        actionTaken: this.actionTaken,
        assignedTo: this.assignedTo,
        remarks: this.remarks,
        dateDue: this.dateDue,
        dateAssigned: date.formatDate(Date.now(), 'YYYY-MM-DD hh:mm A')
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

    editAssignment(assignment, key) {
      this.toolbarTitle = 'Edit Assignment'

      this.id = key
      this.document = assignment.document ? assignment.document : ''
      this.rfqDeadline = assignment.rfqDeadline ? assignment.rfqDeadline : ''
      this.particulars = assignment.particulars ? assignment.particulars : ''
      this.rfqDeadline = assignment.rfqDeadline ? assignment.rfqDeadline : ''
      this.enduser = assignment.enduser ? assignment.enduser : ''
      this.referenceNo = assignment.referenceNo ? assignment.referenceNo : ''
      this.actionTaken = assignment.actionTaken ? assignment.actionTaken : ''
      this.assignedTo = assignment.assignedTo ? assignment.assignedTo : ''
      this.remarks = assignment.remarks ? assignment.remarks : ''
      this.dateDue = assignment.dateDue ? assignment.dateDue : ''
      this.dateAssigned = assignment.dateAssigned ? assignment.dateAssigned : ''

      this.addAssignmentDialog = true
    },

    updateAssignment() {
      const payload = {
        id: this.id,
        updates: {
          document: this.document,
          rfqDeadline: this.rfqDeadline,
          particulars: this.particulars,
          rfqDeadline: this.rfqDeadline,
          enduser: this.enduser,
          referenceNo: this.referenceNo,
          actionTaken: this.actionTaken,
          assignedTo: this.assignedTo,
          remarks: this.remarks,
          dateDue: this.dateDue, // convert data to valid date
          dateAssigned: this.dateAssigned
        }   
      }

      this.$store.dispatch('assignment/update', payload)

      this.addAssignmentDialog = false

    },

    confirmDelete(id) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this assignment?',
        cancel: true
      })
      .onOk(() => this.$store.dispatch('assignment/deleteAssignment', id))
    },

    confirmCompleted(assignment, key) {
      this.$q.dialog({
        title: 'Confirm Completed',
        message: 'Mark the assignment as completed',
        cancel: true
      })
      .onOk(() => this.$store.dispatch('assignment/markAsCompleted', {
        id: key,
        assignment: assignment
      }))
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
      this.$store.dispatch('enduser/add', this.newEnduser)
      this.newEnduser = {
        label: '',
        value: ''
      }
      this.addEnduserDialog = false
    },

    addDocument() {
      this.$q.dialog({
        title: 'Add Document',
        prompt: {
          model: '',
          type: 'text',
          isValid: val => !!val
        },
        cancel: true
      })
      .onOk(data => this.$store.dispatch('document/add', data))
    },

    overdue(assignment) {
      const now = Date.now()
      const dateDue = parseDate(assignment.dateDue)

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
        const parsedDate = parseDate(val)
        const formatDate = date.formatDate(parsedDate, 'MMM D, YYYY')

        return formatDate
      }
      return ''
    },

    showTime(val) {
      if (val) {
        const parsedDate = parseDate(val)
        const formatTime = date.formatDate(parsedDate, 'hh:mm A')
        return formatTime
      }
      return ''
    }
  },
  created() {
    console.log(this.$store.getters['assignment/forOpening'])
  }
}
</script>

<style>
  .btn-download {
    height: 40px;
  }
</style>