export function role(state) {
	const user = state.user
	if (user.role) {
		return user.role
	}
	return 'user'
}