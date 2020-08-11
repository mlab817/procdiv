export function options(state, getters) {
	let options = []
	let sortedStaff = getters.sorted

	Object.keys(sortedStaff).forEach(key => {
		const staff = sortedStaff[key]
		options.push({
			label: staff.name,
			value: staff.name
		})
	})

	return options
}

export function sorted(state) {
	const staffs = state.staff
	let sorted = {}, keysOrdered = Object.keys(staffs)

	
	keysOrdered.sort((a, b) => {
		let aProp = staffs[a].name.toLowerCase(),
			bProp = staffs[b].name.toLowerCase()

		if (aProp > bProp) return 1
		else if (aProp < bProp) return -1
		else return 0
	})

	keysOrdered.forEach(key => {
		sorted[key] = staffs[key]
	})

	return sorted
}