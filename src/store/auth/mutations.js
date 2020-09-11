export function SET_LOGGED_IN(state, payload) {
	state.loggedIn = payload
}

export function SET_USER(state, payload) {
	state.user = payload
}

export function CLEAR_USER(state) {
	state.user = {}
}