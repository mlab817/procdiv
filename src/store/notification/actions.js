import { firebaseFs, firebaseAuth } from 'boot/firebase'
import { date } from 'quasar'
import { showErrorMessage, showSuccessMessage } from 'src/functions'

const docs = firebaseFs.collection('notifications')

export function add({ dispatch }, payload) {
	// notification must have from, to, createdAt, readAt, read, message, subject fields
	const notification = {
		from: payload.from ?  payload.from : '',
		to: payload.to ? payload.to : '',
		createdAt: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
		readAt: '',
		read: false,
		message: payload.message ? payload.message : '',
		subject: payload.subject ? payload.subject : '',
		relatedDoc: payload.relatedDoc ? payload.relatedDoc : '',
		relatedId: payload.relatedId ? payload.relatedId : '',
		deleted: false
	}

	dispatch('fbAdd', notification)
}

export function fbAdd({}, payload) {
	const doc = firebaseFs.collection('notifications')

	doc.add(payload)
		.then(() => {
			console.log('notification sent')
		})
		.catch(err => showErrorMessage(err.message))
}

export function fbReadData({ commit, rootGetters }) {
	// only pick up unread notifications
	// should also pick up only the id of the user
	// const docs = firebaseFs.collection('staff').doc(rootGetters['auth/staffId']).collection('notifications')
	const docs = rootGetters['auth/notificationPath']

	if (docs) {
		docs
			//.where('read','==',false)
			// .where('deleted','==',false)
			.onSnapshot(querySnapshot => {
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
}

export function markAsRead({dispatch}, key) {
	dispatch('fbMarkAsRead', key)
}

export function fbMarkAsRead({ rootGetters }, id) {
	const notificationPath = rootGetters['auth/notificationPath']
	const doc = notificationPath.doc(id)
	const now = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')

	doc.update({
		readAt: now,
		read: true
	})
	.then(() => showSuccessMessage())
	.catch(error => showErrorMessage(error.message))
}

export function deleteNotification({ dispatch }, id) {
	dispatch('fbDelete', id)
}

export function fbDelete({ rootGetters }, id) {
	const path = rootGetters['auth/notificationPath']
	const doc = path.doc(id)

	return doc.update({
		deleted: true
	})
	.then(() => showSuccessMessage())
	.catch(err => showErrorMessage(err.message))
}