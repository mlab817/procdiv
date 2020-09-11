import Vue from 'vue'
import { firebaseFs } from 'boot/firebase'
import { showSuccessMessage, showErrorMessage } from 'src/functions'

const state = () => {
	return {
		users: {}
	}
}

const actions = {
	fbReadData: ({ commit }) => {
		const docs = firebaseFs.collection('users')

		docs.onSnapshot(querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				if (change.type == 'added') {
					const id = change.doc.id
					const data = change.doc.data()
					commit('ADD_USER', {
						id: id,
						data: data
					})
				}
				if (change.type == 'modified') {
					const id = change.doc.id
					const updates = change.doc.data()
					commit('UPDATE_USER', {
						id: id,
						data: updates
					})
				}
				if (change.type == 'removed') {
					const id = change.doc.id
					commit('DELETE_USER', id)
				}
			})
		})
	},
	linkStaff: ({ dispatch }, payload) => {
		dispatch('fbLinkStaff', payload)
	},
	fbLinkStaff: ({}, payload) => {
		// current user and staff id
		const user = firebaseFs.collection('users').doc(payload.id)

		user.update({
			staffId: payload.staffId,
			linked: true
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	},
	promoteToAdmin: ({ dispatch }, id) => {
		dispatch('fbPromoteToAdmin', id)
	},
	fbPromoteToAdmin: ({}, id) => {
		const user = firebaseFs.collection('users').doc(id)

		user.update({
			admin: true,
			role: 'admin'
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	}
}

const mutations = {
	ADD_USER: (state, payload) => {
		Vue.set(state.users, payload.id, payload.data)
	},
	UPDATE_USER: (state, payload) => {
		Vue.set(state.users, payload.id, payload.data)
	},
	DELETE_USER: (state, id) => {
		Vue.delete(state.users, id)
	}
}

const getters = {
	array: (state) => {
		const users = state.users
		let array = []

		Object.keys(users).forEach(key => {
			const user = users[key]
			user.id = key

			array.push(user)
		})

		return array
	},
	options: (state) => {
		const users = state.users
		let array = []

		Object.keys(users).forEach(key => {
			array.push({
				value: key,
				label: users[key].displayName
			})
		})

		return array
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}