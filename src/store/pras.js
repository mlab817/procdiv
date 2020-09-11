import Vue from 'vue'
import { firebaseFs } from 'boot/firebase'
import { showSuccessMessage, showErrorMessage } from 'src/functions'

const state = () => {
	return {
		pras: {}
	}
}

const actions = {
	fbReadData: ({ commit }) => {
		const docs = firebaseFs.collection('pras')

		docs
			.onSnapshot(querySnapshot => {
			querySnapshot
				.docChanges()
				.forEach(change => {

					if (change.type === 'added') {
						// console.log('firestore added', change.doc.data())
						const payload = {
							id: change.doc.id,
							data: change.doc.data()
						}

						commit('ADD_PRAS', payload)
					}

					if (change.type === 'modified') {
						// console.log('firestore modified', change.doc.data())
						const payload = {
							id: change.doc.id,
							data: change.doc.data()
						}

						commit('UPDATE_PRAS', payload)
					}

					if (change.type === 'removed') {
						// console.log('firestore removed', change.doc.data())
						const id = change.doc.id

						commit('DELETE_PRAS', id)
					}
					
				})
		})
	},
	add: ({ dispatch }, payload) => {
		dispatch('fbAdd', payload)
	},
	fbAdd: ({}, payload) => {
		const docs = firebaseFs.collection('pras')

		docs.doc()
			.set(payload)
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	update: ({ dispatch }, payload) => {
		const docs = firebaseFs.collection('pras').doc(payload.id)

		docs.update(payload)
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	delete: ({ dispatch }, id) => {
		dispatch('fbDelete', id)
	},
	fbDelete: ({ dispatch }, id) => {
		const doc = firebaseFs.collection('pras').doc(id)

		doc.update({
			deleted: true
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	}
}

const mutations = {
	ADD_PRAS: (state, payload) => {
		Vue.set(state.pras, payload.id, payload.data)
	},
	UPDATE_PRAS: (state, payload) => {
		Vue.set(state.pras, payload.id, payload.data)
	},
	DELETE_PRAS: (state, id) => {
		Vue.delete(state.pras, id)
	}
}

const getters = {
	pras: (state) => {
		let array = []

		Object.keys(state.pras).forEach(key => {
			const pras = state.pras[key]
			array.push({
				id: key,
				...pras
			})
		})

		console.log(array)

		return array
	},
	options: (state) => {
		return state.pras
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}