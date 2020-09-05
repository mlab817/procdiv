import Vue from 'vue'
import { firebaseFs, firebaseAuth } from 'boot/firebase'

const state = () => {
	return {
		messages: {}
	}
}

const actions = {
	fbReadData: ({ commit, rootGetters }) => {
		const uid = firebaseAuth.currentUser.uid
		
		if (uid) {
			const docs = firebaseFs.collection('users').doc(uid).collection('messages')

			docs.onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {
					const { type, doc } = change
					console.log(type, doc)

					if (type === 'added') {
						const id = change.doc.id
						const data = change.doc.data()

						commit('ADD_MESSAGE', {
							id: id,
							data: data
						})
					}
				})
			})
		}
	}
}

const mutations = {
	ADD_MESSAGE: (state, payload) => {
		Vue.set(state.messages, payload.id, payload.data)
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