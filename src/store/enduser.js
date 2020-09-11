import Vue from 'vue'
import { firebaseDb, firebaseFs } from 'boot/firebase'
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
	fsReadData: ({ commit }) => {
		const docs = firebaseFs.collection('endusers')

		docs.onSnapshot(querySnapshot => {
			querySnapshot
				.docChanges()
				.forEach(change => {

					if (change.type === 'added') {
						// console.log('firestore added', change.doc.id)
						const payload = {
							id: change.doc.id,
							enduser: change.doc.data()
						}

						commit('ADD_ENDUSER', payload)
					}

					if (change.type === 'modified') {
						// console.log('firestore modified', change.doc.id)
						const payload = {
							id: change.doc.id,
							updates: change.doc.data()
						}

						commit('UPDATE_ENDUSER', payload)
					}

					if (change.type === 'removed') {
						// console.log('firestore removed', change.doc.id)
						const id = change.doc.id

						commit('DELETE_ENDUSER', id)
					}
					
				})
		})
	},
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

		// dispatch('fbAdd', enduser)
		dispatch('fsAdd', enduser)
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
	},
	fsAdd: ({}, payload) => {
		const ref = firebaseFs.collection('endusers').doc()

		ref.set(payload.enduser)
			.then(() => showSuccessMessage)
			.catch(err => showErrorMessage(err.message))
	},
	update: ({ dispatch }, payload) => {
		const enduser = {
			id: payload.id,
			updates: payload
		}

		dispatch('fsUpdate', enduser)
	},
	fsUpdate: ({}, payload) => {
		const ref = firebaseFs.collection('endusers').doc(payload.id)

		ref.set(payload.updates)
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	delete: ({ dispatch }, id) => {
		dispatch('fsDelete', id)
	},
	fsDelete: ({}, id) => {
		const ref = firebaseFs.collection('endusers').doc(id)

		ref.delete()
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
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
	options: (state, getters) => {
		let arr = []
		const endusers = getters.sorted

		Object.keys(endusers).forEach(key => {
			const enduser = endusers[key]
			arr.push(enduser)
		})

		return arr
	},
	sorted: (state) => {
		const endusers = state.endusers
		let sorted = {}, keysOrdered = Object.keys(endusers)

		keysOrdered.sort((a, b) => {
			let aProp = endusers[a].label.toLowerCase(),
				bProp = endusers[b].label.toLowerCase()

			if (aProp > bProp) return 1
			else if (aProp < bProp) return -1
			else return 0
		})

		keysOrdered.forEach(key => {
			sorted[key] = endusers[key]
		})

		return sorted
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}