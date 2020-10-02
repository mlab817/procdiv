// convert object to array

export const objectToArray = (object) => {
	if (typeof object === 'object') {
		const array = Object.keys(object).map(key => {
			return {
				...object[key],
				id: key
			}
		})
		return array
	} else {
		return []
	}
}