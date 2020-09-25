/**
 * This helps parse date to ensure it can be read by IOS and Safari
 */
export const parseDate = (date) => {
	if (date) {
	    const formatted = date.replace(/-/g,'/')
	    return new Date(formatted)
	}
	return ''
}