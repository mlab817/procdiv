import { firebaseDb } from 'boot/firebase'
import { uid, date, Loading } from 'quasar'
import { showSuccessMessage, showErrorMessage } from 'src/functions/show-messages'

export function add({ dispatch }, payload) {
	const id = uid()
	const assignment = {
		id: id,
		assignment: payload
	}
	dispatch('fbAdd', assignment)
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

export function update({ dispatch }, payload) {
	dispatch('fbUpdate', payload)
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

export function deleteAssignment({ dispatch }, id) {
	dispatch('fbDelete', id)
}

export function fbMoveToDelete({ state }, payload) {
	const ref = firebaseDb.ref('deleted/' + payload.id)

	ref.set(payload.assignment, error => {
		if (error) {
			showErrorMessage()
		} else {
			showSuccessMessage()
		}
	})
}

export function fbDelete({ state, dispatch }, id) {
	const assignment = state.assignments[id]

	dispatch('fbMoveToDelete', {
		id: id,
		assignment: assignment
	})

	const ref = firebaseDb.ref('assignments/' + id)
	ref.remove(error => {
		if (error) {
			showErrorMessage()
		}
		else {
			showSuccessMessage()
		}
	})
}

export function markAsCompleted({ dispatch }, id) {
	dispatch('fbMarkAsCompleted', id)
}

export function fbMarkAsCompleted({}, id) {
	const ref = firebaseDb.ref('assignments/' + id)

	ref.update({
		dateCompleted: date.formatDate(Date.now(), 'YYYY-MM-DD hh:ss A'),
		completed: true
	}, error => {
		if (error) {
			showErrorMessage()
		} else {
			showSuccessMessage()
		}
	})
}

// payload is id here
export function undoMarkAsCompleted({ dispatch }, id) {
	dispatch('fbUndoMarkAsCompleted', id)
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
		console.log('child changed')
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
		const assignmentId = snapshot.key
		commit('DELETE_ASSIGNMENT', assignmentId)
	})
}