import Vue from 'vue'

export function ADD_STAFF(state, payload) {
	Vue.set(state.staff, payload.id, payload.staff)
}

export function DELETE_STAFF(state, payload) {
	Vue.delete(state.staff, id)
}

export function UPDATE_STAFF(state, payload) {
	Vue.set(state.staff, payload.id, payload.data)
}

export function SET_DOWNLOADED(state, payload) {
	state.downloaded = payload
}