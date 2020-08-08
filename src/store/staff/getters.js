export function options(state) {
	let options = []

	Object.keys(state.staff).forEach(key => {
		const staff = state.staff[key]
		options.push({
			label: staff.name,
			value: staff.name
		})
	})

	return options
}