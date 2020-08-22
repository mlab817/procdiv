import { firebaseFs } from 'boot/firebase'

export function loggedIn(state) {
	if (state.loggedIn) {
		return true
	}
	return false
}

export function role(state) {
	const user = state.user
	if (user.role) {
		return user.role
	}
	return 'user'
}

export function admin(state) {
	const user = state.user
	if (user.admin) {
		return true
	}
	return false
}

export function uid(state) {
	const user = state.user
	if (user.uid) {
		return user.uid
	}
	return ''
}

export function staffId(state) {
	const user = state.user
	if (user.staffId) {
		return user.staffId
	}
	return ''
}

export function notificationPath(state) {
	const user = state.user
	if (user.staffId) {
		return firebaseFs.collection('staff').doc(user.staffId).collection('notifications')
	}
	return firebaseFs.collection('notifications')
}