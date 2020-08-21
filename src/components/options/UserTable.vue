<template>
	<q-table title="Users" :data="users" :columns="columns" :filter="filter" wrap-cells>
		<template v-slot:top-right>
			<q-input v-model="filter" class="q-mr-sm" placeholder="Search" borderless>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
      <q-btn
        color="primary"
        icon-right="archive"
        label="Export"
        no-caps
        @click="exportTable"
      />
    </template>
    <template v-slot:body-cell-avatar="props">
    	<q-td :props="props">
    		<q-avatar>
    			<q-img :src="props.row.photoURL"/>
    		</q-avatar>
    	</q-td>
    </template>
    <template v-slot:body-cell-actions="props">
    	<q-td :props="props">
    		<q-btn 
    			:icon="props.row.linked ? 'link_off' : 'link'" 
    			flat 
    			round 
    			dense 
    			:color="props.row.linked ? 'negative' : 'primary'" 
    			@click="linkStaff(props.row)"
    			:disabled="props.row.linked"></q-btn>
    	</q-td>
    </template>
	</q-table>
</template>

<script>
	import { exportFile } from 'quasar'

	function wrapCsvValue (val, formatFn) {
	  let formatted = formatFn !== void 0
	    ? formatFn(val)
	    : val

	  formatted = formatted === void 0 || formatted === null
	    ? ''
	    : String(formatted)

	  formatted = formatted.split('"').join('""')
	  /**
	   * Excel accepts \n and \r in strings, but some other CSV parsers do not
	   * Uncomment the next two lines to escape new lines
	   */
	  // .split('\n').join('\\n')
	  // .split('\r').join('\\r')

	  return `"${formatted}"`
	}

	export default {
		name: 'UserTable',
		computed: {
			users() {
				return this.$store.getters['user/array']
			},
			staff() {
				const staff = this.$store.state.staff.staff
				let array = []

				Object.keys(staff).forEach(key => {
					const stf = staff[key]
					array.push({
						value: key,
						label: staff[key].name
					})
				})
				return array
			}
		},
		data() {
			return {
				filter: '',
				columns: [
					{
						name: 'avatar',
						label: 'Avatar',
						field: 'photoURL',
						align: 'center'
					},
					{
						name: 'displayName',
						label: 'Display Name',
						field: 'displayName',
						align: 'center'
					},
					{
						name: 'email',
						label: 'Email',
						field: 'email',
						align: 'center'
					},
					{
						name: 'role',
						label: 'Role',
						field: 'role',
						align: 'center'
					},
					{
						name: 'uid',
						label: 'User ID',
						field: 'uid',
						align: 'center'
					},
					{
						name: 'staffId',
						label: 'Staff',
						field: (row) => this.getStaffName(row.staffId)
					},
					{
						name: 'actions',
						label: 'Actions'
					}
				]
			}
		},
		methods: {
			getStaffName(id) {
				const assocStaff = this.staff.filter(x => x.value === id)
				
				if (assocStaff.length > 0) {
					return assocStaff[0].label
				} else {
					return ''
				}
			},
	    exportTable () {
	      // naive encoding to csv format
	      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
	        this.users.map(row => this.columns.map(col => wrapCsvValue(
	          typeof col.field === 'function'
	            ? col.field(row)
	            : row[col.field === void 0 ? col.name : col.field],
	          col.format
	        )).join(','))
	      ).join('\r\n')

	      const status = exportFile(
	        'table-export.csv',
	        content,
	        'text/csv'
	      )

	      if (status !== true) {
	        this.$q.notify({
	          message: 'Browser denied file download...',
	          color: 'negative',
	          icon: 'warning'
	        })
	      }
	    },
	    linkStaff(user) {
	    	const staff = this.staff
	    	
	    	this.$q.dialog({
	    		title: 'Link Staff',
	    		message: 'Assign this user to a staff. This will allow them to view their tasks and receive in-app notifications.',
	    		cancel: true,
	    		persistent: true,
	    		options: {
	    			model: '',
	    			items: staff,
	    			type: 'radio',
	    			isValid: val => !!val
	    		}
	    	})
	    	.onOk(data => {
	    		// data is staff id here
	    		const payload = {
	    			id: user.uid,
	    			staffId: data
	    		}
	    		this.handleLink(payload)
	    	})
	    },
	    handleLink(payload) {
	    	// handle link here
	    	this.$store.dispatch('user/linkStaff', payload)
	    }
	  }
	}
</script>