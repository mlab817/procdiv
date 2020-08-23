<template>
	<div>
		<div class="row justify-end q-mb-md">
			<q-btn label="Add Document" color="primary" @click="addDocument" />
		</div>
		<q-table title="Documents" :data="documents" :filter="filter" :columns="columns" :grid="$q.screen.lt.sm">
			<template v-slot:top-right>
				<q-input borderless v-model="filter" placeholder="Search" class="q-mr-sm">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
			<template v-slot:body-cell-actions="props">
				<q-td :props="props">
					<q-btn color="primary" round icon="edit" @click.stop="editItem(props.row)" dense flat />
		      <q-btn color="negative" round icon="delete" @click.stop="deleteItem(props.row)" dense flat />
				</q-td>
			</template>
			<template v-slot:item="props">
				<div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
					<q-card>
						<q-card-section class="q-pa-none">
							<q-list dense>
	              <q-item v-for="col in props.cols.filter(col => col.name !== 'actions')" :key="col.name">
	                <q-item-section>
	                  <q-item-label caption>{{ col.label }}</q-item-label>
	                </q-item-section>
	                <q-item-section side>
	                  <q-item-label class="text-black">{{ col.value }}</q-item-label>
	                </q-item-section>
	              </q-item>
	            </q-list>
						</q-card-section>
						<q-card-actions align="right" v-if="admin">
							<q-btn color="primary" round icon="edit" @click.stop="editItem(props.row)" dense flat />
		       	 	<q-btn color="negative" round icon="delete" @click.stop="deleteItem(props.row)" dense flat />
						</q-card-actions>
					</q-card>
				</div>
			</template>
		</q-table>
	</div>
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
			},
			admin() {
				return this.$store.getters['auth/admin']
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
					},
					{
						name: 'actions',
						label: 'Actions',
						align: 'center'
					}
				]
			}
		},
		methods: {
			addDocument() {
				this.$q.dialog({
					title: 'Add Document',
					message: 'Enter document.',
					prompt: {
						model: '',
						type: 'text',
						isValid: val => !!val
					},
					persistent: true,
					cancel: true
				}).onOk(data => this.$store.dispatch('document/add', data))
			},
			deleteItem(row) {
				console.log(row)
				this.$q.dialog({
					title: 'Delete Document',
					message: `Are you sure you want to delete <strong>${row.name}?</strong> Type <strong>Yes</strong> to confirm.`,
					cancel: true,
					persistent: true,
					html: true,
					prompt: {
						type: 'text',
						model: '',
						isValid: val => (val.toLowerCase() === 'yes')
					}
				}).onOk(() => this.$store.dispatch('document/delete', row.id))
			},
			editItem(row) {
				const name = row.name
				const id = row.id

				this.$q.dialog({
					title: 'Edit Document',
					persisten: true,
					cancel: true,
					prompt: {
						model: name,
						type: 'text',
						isValid: val => !!val
					}
				}).onOk(data => {
					console.log('>>>>> ', data)
					const payload = {
						id: id, 
						updates: data
					}
					this.$store.dispatch('document/update', payload)
				})
			},
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