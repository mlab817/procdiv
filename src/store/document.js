import Vue from 'vue'
import { firebaseDb, firebaseFs } from 'boot/firebase'
import {
	showErrorMessage,
	showSuccessMessage
} from 'src/functions/show-messages'
import { uid } from 'quasar'

const state = () => {
	return {
		documents: {},
		downloaded: false
	}
}

const mutations = {
	SET_DOWNLOADED: (state, payload) => {
		state.downloaded = payload
	},
	ADD_DOCUMENT: (state, payload) => {
		Vue.set(state.documents, payload.id, payload.document)
	},
	UPDATE_DOCUMENT: (state, payload) => {
		Vue.set(state.documents, payload.id, payload.updates)
	},
	DELETE_DOCUMENT: (state, id) => {
		Vue.delete(state.documents, id)
	}
}

const actions = {
	add: ({ dispatch }, payload) => {
		const id = uid()
		const doc = {
			id: id, 
			doc: {
				name: payload
			}
		}

		// dispatch('fbAdd', doc)
		dispatch('fsAdd', doc)
	},
	fsAdd: ({}, payload) => {
		const ref = firebaseFs.collection('documents').doc()

		ref.set(payload.doc)
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	update: ({ dispatch }, payload) => {
		dispatch('fbUpdate', payload)
	},
	delete: ({ dispatch }, id) => {
		dispatch('fbDelete', id)
	},
	fbDelete: ({}, id) => {
		const doc = firebaseFs.collection('documents').doc(id)

		doc.delete()
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
	},
	fsReadData: ({ commit }) => {
		const docs = firebaseFs.collection('documents')

		docs.onSnapshot(querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				if (change.type == 'added') {
					const id = change.doc.id
					const data = change.doc.data()
					commit('ADD_DOCUMENT', {
						id: id,
						document: data
					})
				}
				if (change.type == 'modified') {
					const id = change.doc.id
					const updates = change.doc.data()
					commit('UPDATE_DOCUMENT', {
						id: id,
						updates: updates
					})
				}
				if (change.type == 'removed') {
					console.log('removed id: ', change.doc.id)
					const id = change.doc.id
					commit('DELETE_DOCUMENT', id)
				}
			})
		})
	}
}

const getters = {
	options: (state, getters) => {
		let options = []
		const sortedDocuments = getters.sorted

		Object.keys(sortedDocuments).forEach(key => {
			options.push({
				value: sortedDocuments[key].name,
				label: sortedDocuments[key].name
			})
		})

		return options
	},
	sorted: (state) => {
		const documents = state.documents
		let sorted = {}, keysOrdered = Object.keys(documents)
		
		keysOrdered.sort((a, b) => {
			let aProp = documents[a].name.toLowerCase(),
				bProp = documents[b].name.toLowerCase()

			if (aProp > bProp) return 1
			else if (aProp < bProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			sorted[key] = documents[key]
		})

		return sorted
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}