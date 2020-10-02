export const wrapCsvValue = (val, formatFn) => {
	let formatted = formatFn !== void 0
		? formatFn(val)
		: val
	
	formatted = formatted === void 0 || formatted === null
		? ''
		: String(formatted)
	
	formatted = formatted.split('"').join('""')
		.split('\n').join('\\n')
		.split('\r').join('\\r')
	
	return `"${formatted}"`
}
