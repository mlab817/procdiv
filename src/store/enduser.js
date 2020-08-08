import Vue from 'vue'
import { firebaseDb } from 'boot/firebase'
import { 
	showErrorMessage,
	showSuccessMessage
} from 'src/functions/show-messages'
import { uid } from 'quasar'

const state = () => {
	return {
		endusers: {},
		downloaded: false
	}
}

const actions = {
	fbReadData: ({ commit }) => {
		const endusers = firebaseDb.ref('endusers')

		endusers.once('value', snapshot => {
			commit('SET_DOWNLOADED', true)
		}, error => {
			this.$router.push('/auth')
		})

		endusers.on('child_added', snapshot => {
			const id = snapshot.key
			const enduser = snapshot.val()

			const payload = {
				id: id,
				enduser: enduser
			}

			commit('ADD_ENDUSER', payload)
		})

		endusers.on('child_changed', snapshot => {
			const id = snapshot.key
			const enduser = snapshot.val()

			const payload = {
				id: id,
				updates: enduser
			}

			commit('UPDATE_ENDUSER', payload)
		})

		endusers.on('child_removed', snapshot => {
			const id = snapshot.key
			commit('DELETE_ENDUSER', id)
		})
	},
	add: ({ dispatch }, payload) => {
		const id = uid()
		const enduser = {
			id: id,
			enduser: {
				label: payload.label,
				value: payload.value
			}
		}

		dispatch('fbAdd', enduser)
	},
	fbAdd: ({}, payload) => {
		const ref = firebaseDb.ref('endusers/' + payload.id)

		ref.set(payload.enduser, error => {
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
	ADD_ENDUSER: (state, payload) => {
		Vue.set(state.endusers, payload.id, payload.enduser)
	},
	UPDATE_ENDUSER: (state, payload) => {
		Vue.set(state.endusers, payload.id, payload.updates)
	},
	DELETE_ENDUSER: (state, id) => { 
		Vue.delete(state.endusers, id)
	}
}

const getters = {
	options: (state) => {
		let arr = []
		const endusers = state.endusers

		Object.keys(endusers).forEach(key => {
			const enduser = endusers[key]
			arr.push(enduser)
		})

		return arr
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}