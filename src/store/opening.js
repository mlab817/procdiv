import Vue from 'vue'
import { firebaseFs } from 'boot/firebase'
import { showSuccessMessage, showErrorMessage } from 'src/functions'
import { date } from 'quasar'

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
			assignedId: payload.assignedId,
			assignedName: payload.assignedName,
			enduser: payload.enduser,
			particulars: payload.particulars,
			referenceNo: payload.referenceNo,
			rfqDeadline: payload.rfqDeadline,
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
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	open: ({ dispatch }, id) => {
		dispatch('fbOpen', id)
	},
	fbOpen: ({}, id) => {
		const doc = firebaseFs.collection('openings').doc(id)

		doc.update({
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