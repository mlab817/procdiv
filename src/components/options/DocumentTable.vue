<template>
	<q-table title="Documents" :data="documents" :filter="filter" :columns="columns" :grid="$q.screen.lt.sm">
		<template v-slot:top-right>
			<q-input borderless v-model="filter" placeholder="Search" class="q-mr-sm">
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
		name: 'DocumentTable',
		computed: {
			documents() {
				const documents = this.$store.state.document.documents
				let array = []

				Object.keys(documents).forEach(key => {
					const doc = documents[key]
					array.push(doc)
				})

				return array
			}
		},
		data() {
			return {
				filter: '',
				columns: [
					{
						name: 'id',
						label: 'ID',
						field: 'id',
						align: 'left'
					},
					{
						name: 'name',
						label: 'Name',
						field: 'name',
						align: 'left'
					}
				]
			}
		},
		methods: {
			exportTable () {
	      // naive encoding to csv format
	      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
	        this.documents.map(row => this.columns.map(col => wrapCsvValue(
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