import Vue from 'vue'
import { firebaseDb, firebaseFs } from 'boot/firebase'
import { uid, date, Loading } from 'quasar'
import { showSuccessMessage, showErrorMessage } from 'src/functions/show-messages'

export function add({ dispatch }, payload) {
	const id = uid()
	const assignment = {
		id: id,
		assignment: payload
	}
	// dispatch('fbAdd', assignment)
	dispatch('fsAdd', assignment)
}

export function fbAdd({}, payload) {
	const ref = firebaseDb.ref('assignments/'+ payload.id)

	return ref.set(payload.assignment, error => {
		if (error) {
			showErrorMessage()
		}
		else {
			showSuccessMessage()
		}
	})
}

export function fsAdd({ dispatch }, payload) {
	const docRef = firebaseFs.collection('assignments')

	docRef.add(payload.assignment)
		.then((docRef) => {
			showSuccessMessage()
			const { referenceNo, document, assignedTo } = payload.assignment
			const message = `${referenceNo}: ${document}`

			const notification = {
				from: this.state.auth.user.displayName,
				to: assignedTo.id,
				subject: 'New Assignment',
				message: message,
				relatedDoc: 'assignments',
				relatedId: docRef.id
			}

			dispatch('notification/add', notification, { root: true })
		})
		.catch(err => showErrorMessage(err.message))
}

export function update({ dispatch }, payload) {
	// dispatch('fbUpdate', payload)
	dispatch('fsUpdate', payload)
}

export function fbUpdate({}, payload) {
	const ref = firebaseDb.ref('assignments/' + payload.id)

	ref.update(payload.updates, error => {
		if (error) {
			showErrorMessage()
		}
		else {
			showSuccessMessage()
		}
	})
}

export function fsUpdate({}, payload) {
	console.log('fsUpdate')

	const ref = firebaseFs.collection('assignments').doc(payload.id)

	ref.update(payload.updates)
		.then(() => showSuccessMessage())
		.catch(error => showErrorMessage(error.message))
}

export function deleteAssignment({ dispatch }, id) {
	dispatch('fbDelete', id)
	dispatch('fsDelete', id)
}

export function fbDelete({ state, dispatch }, id) {
	console.log(id)
	const ref = firebaseDb.ref('assignments/' + id)
	ref.update({
		status: 'deleted'
	}, error => {
		if (error) {
			showErrorMessage()
		}
		else {
			showSuccessMessage()
		}
	})
}

export function fsDelete({ state, dispatch }, id) {
	console.log(id)
	const ref = firebaseFs.collection('assignments').doc(id)

	ref.update({ status: 'deleted' })
		.then(() => showSuccessMessage)
		.catch(err => showErrorMessage(err.message))
}

export function permaDelete({ dispatch }, id) {
	dispatch('fsPermaDelete', id)
}

export function fsPermaDelete({}, id) {
	const ref = firebaseFs.collection('assignments').doc(id)

	ref.delete()
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
}

export function undoDelete({ dispatch }, id) {
	dispatch('fsUndoDelete', id)
}

export function fsUndoDelete({}, id) {
	console.log(id)
	const ref = firebaseFs.collection('assignments').doc(id)

	ref.update({
		status: 'ongoing'
	})
	.then(() => showSuccessMessage())
	.catch(err => showErrorMessage(err.message))
}

export function markAsCompleted({ dispatch }, payload) {
	dispatch('fsMarkAsCompleted', payload.id)
	if (payload.assignment.document === 'PRAS/ PR for preparation of RFQ') {
		dispatch('fbMarkAsForOpening', payload.assignment)
	}
}

export function fbMarkAsForOpening({}, payload) {
	// create a new document that has status for opening
	const doc = firebaseFs.collection('assignments').doc()
	const newObj = Object.assign({}, payload)
	Vue.set(newObj, 'status', 'for opening')
	Vue.set(newObj, 'document', 'Waiting for opening')

	console.log(newObj)

	doc.set(newObj)
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
}

export function fsMarkAsCompleted({}, id) {
	const ref = firebaseFs.collection('assignments').doc(id)
	const dateCompleted = date.formatDate(Date.now(), 'YYYY-MM-DD hh:mm A')

	ref.update({
		status: 'completed',
		dateCompleted: dateCompleted
	})
	.then(() => showSuccessMessage)
	.catch(err => showErrorMessage(err.message))
}

// payload is id here
export function undoMarkAsCompleted({ dispatch }, id) {
	// dispatch('fbUndoMarkAsCompleted', id)
	dispatch('fsUndoMarkAsCompleted', id)
}

export function fsUndoMarkAsCompleted({}, id) {
	const ref = firebaseFs.collection('assignments').doc(id)

	ref.update({
		dateCompleted: '',
		status: 'ongoing'
	})
	.then(() => showSuccessMessage())
	.catch(err => showErrorMessage(err.message))
}

export function setSortBy({ commit }, payload) {
	commit('SET_SORT_BY', payload)
}

export function setSortDir({ commit }, payload) {
	commit('SET_SORT_DIR', payload)
}

export function setSearch({ commit }, payload) {
	commit('SET_SEARCH', payload)
}

export function filterByDate({ commit }, payload) {
	commit('SET_START', payload.start)
	commit('SET_END', payload.end)
}

export function fsReadData({ commit, rootGetters }) {
	const role = rootGetters['auth/role']
	const uid = rootGetters['auth/uid']
	console.log(role,uid)

	let docs
	if (role === 'user') {
		docs = firebaseFs.collection('assignments').where('assignedTo','==',uid)
	} else {
		docs = firebaseFs.collection('assignments')
	}

	docs.onSnapshot(querySnapshot => {
		querySnapshot
			.docChanges()
			.forEach(change => {

				if (change.type === 'added') {
					// console.log('firestore added', change.doc.data())
					const payload = {
						id: change.doc.id,
						assignment: change.doc.data()
					}

					commit('ADD_ASSIGNMENT', payload)
				}

				if (change.type === 'modified') {
					// console.log('firestore modified', change.doc.data())
					const payload = {
						id: change.doc.id,
						updates: change.doc.data()
					}

					commit('UPDATE_ASSIGNMENT', payload)
				}

				if (change.type === 'removed') {
					// console.log('firestore removed', change.doc.data())
					const id = change.doc.id

					commit('DELETE_ASSIGNMENT', id)
				}
				
			})
	})
}