import { Notify } from 'quasar'

export function showSuccessMessage() {
	Notify.create({
		type: 'positive',
		message: 'Success'
	})
}

export function showErrorMessage(message) {
	Notify.create({
		type: 'negative',
		message: message ? message: 'Error'
	})
}