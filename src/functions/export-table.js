import { exportFile } from 'quasar'
import { wrapCsvValue } from 'src/functions'

export const exportTable = (data = [], cols = [], title='export.csv') => {
	// define the content of the file from the data
	const content = [ cols.map(col => wrapCsvValue(col.label)) ].concat(
    data.map(row => cols.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    title,
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