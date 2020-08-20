import Vue from 'vue'
import { firebaseFs } from 'boot/firebase'

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
				id: key,
				displayName: users[key].displayName
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