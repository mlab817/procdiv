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

export function fsAdd({}, payload) {
	console.log(payload)
	firebaseFs
		.collection('assignments')
		.doc()
		.set(payload.assignment)
		.then(() => showSuccessMessage())
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

export function markAsCompleted({ dispatch }, id) {
	dispatch('fbMarkAsCompleted', id)
	dispatch('fsMarkAsCompleted', id)
}

export function fbMarkAsCompleted({}, id) {
	const ref = firebaseDb.ref('assignments/' + id)

	ref.update({
		dateCompleted: new Date(),
		status: 'completed'
	}, error => {
		if (error) {
			showErrorMessage(error.message)
		} else {
			showSuccessMessage()
		}
	})
}

export function fsMarkAsCompleted({}, id) {
	const ref = firebaseFs.collection('assignments').doc(id)

	ref.update({
		status: 'completed',
		dateCompleted: Date.now()
	})
	.then(() => showSuccessMessage)
	.catch(err => showErrorMessage(err.message))
}

// payload is id here
export function undoMarkAsCompleted({ dispatch }, id) {
	// dispatch('fbUndoMarkAsCompleted', id)
	dispatch('fsUndoMarkAsCompleted', id)
}

export function fbUndoMarkAsCompleted({}, id) {
	const ref = firebaseDb.ref('assignments/' + id)

	ref.update({
		dateCompleted: '',
		completed: false
	}, error => {
		if (error) {
			showErrorMessage()
		} else {
			showSuccessMessage()
		}
	})
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

export function fsReadData({ commit }) {
	const docs = firebaseFs.collection('assignments')

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

export function fbReadData({ commit }) {
	const assignments = firebaseDb.ref('assignments')

	// initial check for data
	assignments.once('value', snapshot => {
		commit('SET_DOWNLOADED', true)
	}, error => {
		this.$router.replace('/auth')
	})

	// child added
	assignments.on('child_added', snapshot => {
		console.log('realtime db added')
		const assignment = snapshot.val()
		assignment.id = snapshot.key

		const payload = {
			id: snapshot.key,
			assignment: assignment
		}
		commit('ADD_ASSIGNMENT', payload)
	})

	// child changed
	assignments.on('child_changed', snapshot => {
		console.log('realtime db changed')

		const assignment = snapshot.val()
		assignment.id = snapshot.key

		const payload = {
			id: snapshot.key,
			updates: assignment
		}
		commit('UPDATE_ASSIGNMENT', payload)
	})

	// child removed
	assignments.on('child_removed', snapshot => {
		console.log('realtime db removed')
		const assignmentId = snapshot.key
		commit('DELETE_ASSIGNMENT', assignmentId)
	})
}