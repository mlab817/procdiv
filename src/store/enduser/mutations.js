export function ADD_ENDUSER (state, payload) {
	state.endusers.push({
		label: payload && payload.toUpperCase(),
		value: payload
	})
}
