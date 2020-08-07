import { Notify } from 'quasar'

export function showSuccessMessage() {
	Notify.create({
		type: 'positive',
		message: 'Success'
	})
}

export function showErrorMessage() {
	Notify.create({
		type: 'negative',
		message: 'Error'
	})
}