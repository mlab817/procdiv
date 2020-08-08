import { firebaseDb } from 'boot/firebase'
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
	dispatch('fbAdd', staff)
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