export function role(state) {
	const user = state.user
	if (user.role) {
		return user.role
	}
	return 'user'
}

export function uid(state) {
	const user = state.user
	if (user.uid) {
		return user.uid
	}
	return ''
}