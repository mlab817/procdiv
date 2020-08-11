/**
 * This helps parse date to ensure it can be read by IOS and Safari
 */
export const parseDate = (date) => {
	if (date) {
	    return date.replace(/-/g,'/')
	}
	return ''
}