import Vue from 'vue'
import { firebaseFs } from 'boot/firebase'
import { showSuccessMessage, showErrorMessage } from 'src/functions'
import { date, Loading } from 'quasar'

const state = () => {
	return {
		openings: {}
	}
}

const actions = {
	fbReadData: ({ commit, rootGetters }) => {
		const admin = rootGetters['auth/admin']
		const staffId = rootGetters['auth/staffId']

		let docs

		if (!admin && !staffId) {
			return
		} else {
			if (admin) {
				docs = firebaseFs.collection('openings')
			}
			else {
				docs = firebaseFs.collection('openings').where('assignedId','==',staffId)
			}

			docs.onSnapshot(querySnaphot => {
				querySnaphot.docChanges().forEach(change => {
					if (change.type === 'added') {
						const payload = {
							id: change.doc.id,
							data: change.doc.data()
						}

						commit('ADD_OPENING', payload)
					}

					if (change.type === 'modified') {
						const payload = {
							id: change.doc.id,
							data: change.doc.data()
						}

						commit('UPDATE_OPENING', payload)
					}

					if (change.type === 'removed') {
						const id = change.doc.id

						commit('DELETE_OPENING', id)
					}
				})
			})
		}
	},
	add: ({ dispatch }, payload) => {
		console.log('add opening: ', payload)
		const opening = {
			assignedId: payload.assignedId || null,
			assignedName: payload.assignedName || null,
			enduser: payload.enduser || null,
			particulars: payload.particulars || null,
			referenceNo: payload.referenceNo || null,
			rfqDeadline: payload.rfqDeadline || null,
			taskId: payload.id
		}
		opening.dateOpened = ''
		opening.opened = false

		dispatch('fbAdd', opening)
	},
	fbAdd: ({}, payload) => {
		const doc = firebaseFs.collection('openings').doc()

		doc
			.set(payload)
			.then(() => Loading.hide())
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	open: ({ dispatch }, payload) => {
		// payload contains { result, id }
		dispatch('fbOpen', payload)
	},
	fbOpen: ({}, payload) => {
		const doc = firebaseFs.collection('openings').doc(payload.id)

		doc.update({
			result: payload.result,
			opened: true,
			dateOpened: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	},
	delete: ({}, id) => {
		const doc = firebaseFs.collection('openings').doc(id)

		doc.update({
			deleted: true
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	}
}

const mutations = {
	ADD_OPENING: (state, payload) => {
		Vue.set(state.openings, payload.id, payload.data)
	},
	UPDATE_OPENING: (state, payload) => {
		Vue.set(state.openings, payload.id, payload.data)
	},
	DELETE_OPENING: (state, id) => {
		Vue.delete(state.openings, id)
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
