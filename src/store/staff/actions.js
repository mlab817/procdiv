import { firebaseDb, firebaseFs } from 'boot/firebase'
import { uid } from 'quasar'
import {
	showErrorMessage,
	showSuccessMessage
} from 'src/functions/show-messages'

export function add({ dispatch }, payload) {
	const id = uid()
	const staff = {
		id: id,
		staff: {
			name: payload
		}
	}
	// dispatch('fbAdd', staff)
	dispatch('fsAdd', staff)
}

export function fbAdd({}, payload) {
	const ref = firebaseDb.ref('staff/' + payload.id)

	return ref.set(payload.staff, error => {
		if (error) {
			showErrorMessage()
		}
		else {
			showSuccessMessage()
		}
	})
}

export function fsAdd({}, payload) {
	const ref = firebaseFs.collection('staff').doc()

	ref.set(payload.staff)
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
}

export function fsReadData({ commit }) {
	console.log('reading data for staff')
	const docs = firebaseFs.collection('staff')

	docs.onSnapshot(querySnapshot => {
		querySnapshot
			.docChanges()
			.forEach(change => {

				if (change.type === 'added') {
					console.log('firestore added', change.doc.id)
					const payload = {
						id: change.doc.id,
						staff: change.doc.data()
					}

					commit('ADD_STAFF', payload)
				}

				if (change.type === 'modified') {
					console.log('firestore modified', change.doc.id)
					const payload = {
						id: change.doc.id,
						updates: change.doc.data()
					}

					commit('UPDATE_STAFF', payload)
				}

				if (change.type === 'removed') {
					console.log('firestore removed', change.doc.id)
					const id = change.doc.id

					commit('DELETE_STAFF', id)
				}
				
			})
	})
}

export function fbReadData({ commit }) {
	const staff = firebaseDb.ref('staff')

	// initial check for data
	staff.once('value', snapshot => {
		commit('SET_DOWNLOADED', true)
	}, error => {
		this.$router.replace('/auth')
	})

	// child added
	staff.on('child_added', snapshot => {
		const staff = snapshot.val()
		staff.id = snapshot.key

		const payload = {
			id: snapshot.key,
			staff: staff
		}
		commit('ADD_STAFF', payload)
	})

	// child changed
	staff.on('child_changed', snapshot => {
		console.log('child changed')
		const staff = snapshot.val()
		staff.id = snapshot.key

		const payload = {
			id: snapshot.key,
			updates: staff
		}
		commit('UPDATE_STAFF', payload)
	})

	// child removed
	staff.on('child_removed', snapshot => {
		const staffId = snapshot.key
		commit('DELETE_STAFF', staffId)
	})
}