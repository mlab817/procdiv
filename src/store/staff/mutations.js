export function ADD_STAFF(state, payload) {
	state.staff.push({
		label: payload,
		value: payload
	})
}