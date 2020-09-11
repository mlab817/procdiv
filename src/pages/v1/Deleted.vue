<template>
	<q-page padding>
		<div class="row q-my-sm" v-if="$q.screen.lt.md">
			<!-- change to search for deleted -->
  		<search class="col" />
  	</div>

    <div class="row justify-end q-mb-md">
      <div class="row">
      	<!-- change sort and search for deleted -->
      	<sort />
      	
      	<search class="q-ml-sm" v-if="$q.screen.gt.sm" /> 
      </div>
    </div>

    <q-toolbar class="bg-negative text-white q-mt-md text-center">
      <q-toolbar-title>
        Deleted
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
        <template v-if="Object.keys(deleted).length">
          <tr v-for="(assignment, key) in deleted" :key="key">
            <td>{{assignment.dateAssigned}}</td>
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
            <td class="text-center items-center q-gutter-sm" v-if="role ==='admin'">
              <q-btn dense icon="restore" color="primary" @click="restore(key)"></q-btn>
              <q-btn dense icon="delete" color="negative" @click="confirmDelete(key)"></q-btn>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="text-center text-negative" colspan="10">Trash is empty.</td>
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
	export default {
    components: {
      'search': () => import('../../components/shared/Search.vue'),
      'sort': () => import('../../components/shared/Sort.vue')
    },
		name: 'PageDeleted',
		computed: {
      role() {
        return this.$store.getters['auth/role']
      },

			deleted() {
				return this.$store.getters['assignment/deleted']
			}
		},
		methods: {
			restore(id) {
				this.$q.dialog({
					title: 'Restore Assignment', 
					message: 'Are you sure you want to restore assignment?',
					persistent: true,
					cancel: true
				})
				.onOk(() => this.$store.dispatch('assignment/undoDelete', id))
			},
      confirmDelete(id) {
        this.$q.dialog({
          title: 'Permanently Delete',
          message: `Are you sure you want to delete this assignment? Please type the following key to delete: <strong>${id}</strong>.`,
          cancel: true,
          persistent: true,
          html: true,
          prompt: {
            model: '',
            type: 'text',
            isValid: val => val === id,
            outlined: true,
            label: 'Key',
            stackLabel: true
          }
        })
        .onOk(() => {
          this.permaDelete(id)
        })
      },
      permaDelete(id) {
        this.$store.dispatch('assignment/permaDelete', id)
      }
		}
	}
</script>