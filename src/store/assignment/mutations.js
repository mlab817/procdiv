import Vue from 'vue'

export function ADD_ASSIGNMENT(state, payload) {
	Vue.set(state.assignments, payload.id, payload.assignment)
}

export function UPDATE_ASSIGNMENT(state, payload) {	
	Vue.set(state.assignments, payload.id, payload.updates)
}

export function DELETE_ASSIGNMENT(state, id) {
	Vue.delete(state.assignments, id)
}

export function SET_SEARCH(state, payload) {
	state.search = payload
}

export function SET_DOWNLOADED(state, payload) {
	state.downloaded = payload
}

export function CLEAR_ASSIGNMENTS(state) {
	state.assignments = {}
}

export function SET_SORT_BY(state, payload) {
	state.sortBy = payload
}

export function SET_SORT_DIR(state, payload) {
	state.sortDir = payload
}

export function SET_START(state, payload) {
	state.start = payload
}

export function SET_END(state, payload) {
	state.end = payload
}