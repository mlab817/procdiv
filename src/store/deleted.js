import Vue from 'vue'
import { firebaseDb } from 'boot/firebase'
import { showSuccessMessage, showErrorMessage } from 'src/functions/show-messages'

const state = () => {
	return {
		deleted: {},
		sortBy: '',
		sortDir: 'asc',
		search: '',
		downloaded: false
	}
}

const actions = {
	fbReadData({ commit }) {
		const deleted = firebaseDb.ref('deleted')

		deleted.once('value', snapshot => {
			commit('SET_DOWNLOADED', true)
		}, error => {
			this.$router.push('/auth')
		})

		deleted.on('child_added', snapshot => {
			const id = snapshot.key
			const item = snapshot.val()

			const payload = {
				id: id,
				item: item
			}

			commit('ADD_DELETED', payload)
		})

		deleted.on('child_removed', snapshot => {
			const id = snapshot.key
			commit('DELETE_DELETED', id)
		})
	},

	restore: ({ dispatch }, assignment) => {
		dispatch('fbRestore', assignment)
	},

	fbRestore: ({ dispatch }, assignment) => {
		// add it to assignments
		const ref = firebaseDb.ref('assignments/' + assignment.id)

		ref.set(assignment, error => {
			if (error) {
				showErrorMessage()
			} else {
				showSuccessMessage()
			}
		})

		// remove from deleted
		dispatch('fbDelete', assignment.id)
	},

	fbDelete: ({}, id) => {
		const ref = firebaseDb.ref('deleted/' + id)

		ref.remove(error => {
			if (error) {
				showErrorMessage()
			} else {
				showSuccessMessage()
			}
		})
	}
}

const mutations = {
	SET_DOWNLOADED: (state, payload) => {
		state.downloaded = payload
	},
	ADD_DELETED: (state, payload) => {
		Vue.set(state.deleted, payload.id, payload.item)
	},
	DELETE_DELETED: (state, id) => {
		Vue.delete(state.deleted, id)
	}
}

const getters = {}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}