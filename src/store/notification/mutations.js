import Vue from 'vue'

export function ADD_NOTIFICATION(state, payload) {
	Vue.set(state.notifications, payload.id, payload.data)
}

export function UPDATE_NOTIFICATION(state, payload) {
	Vue.set(state.notifications, payload.id, payload.data)
}

export function DELETE_NOTIFICATION(state, id) {
	Vue.delete(state.notifications, id)
}