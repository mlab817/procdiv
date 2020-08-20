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
					}
				]
			}
		},
		methods: {
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
	    }
	  }
	}
</script>