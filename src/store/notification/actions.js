import { firebaseFs } from 'boot/firebase'

const docs = firebaseFs.collection('notifications')

export function fbReadData({ commit }) {
	docs.onSnapshot(querySnapshot => {
		querySnapshot
			.docChanges()
			.forEach(change => {

				if (change.type === 'added') {
					// console.log('firestore added', change.doc.data())
					const payload = {
						id: change.doc.id,
						data: change.doc.data()
					}

					commit('ADD_NOTIFICATION', payload)
				}

				if (change.type === 'modified') {
					// console.log('firestore modified', change.doc.data())
					const payload = {
						id: change.doc.id,
						data: change.doc.data()
					}

					commit('UPDATE_NOTIFICATION', payload)
				}

				if (change.type === 'removed') {
					// console.log('firestore removed', change.doc.data())
					const id = change.doc.id

					commit('DELETE_NOTIFICATION', id)
				}
				
			})
	})
}