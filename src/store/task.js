import Vue from 'vue'
import { firebaseFs, firebaseAuth } from 'boot/firebase'
import { showErrorMessage, showSuccessMessage } from 'src/functions'
import { date, Loading } from 'quasar'
import { parseDate } from 'src/functions'

const state = () => {
	return {
		tasks: {}
	}
}

const actions = {
	fbReadData: ({ commit, rootGetters }) => {
		// if user is admin, allow them to see all tasks, otherwise filter to staffId
		const admin = rootGetters['auth/admin']
		const staffId = rootGetters['auth/staffId']

		if (!admin && !staffId) {
			return
		} else {
			let docs

			if (admin) {
				docs = firebaseFs.collection('tasks')
			}
			else {
				docs = firebaseFs.collection('tasks').where('assignedId','==',staffId)
			}

			docs
				.onSnapshot(querySnapshot => {
					querySnapshot
						.docChanges()
						.forEach(change => {
							const { type, doc } = change

							if (type === 'added') {
								const payload = {
									id: doc.id,
									data: doc.data()
								}

								commit('ADD_TASK', payload)
							}

							if (type === 'modified') {
								const payload = {
									id: doc.id,
									data: doc.data()
								}

								commit('UPDATE_TASK', payload)
							}

							if (type === 'removed') {
								commit('DELETE_TASK', doc.id)
							}

						})
				})
		}

	},

	addTask: ({ dispatch }, payload) => {
		const taskToAdd = {
			...payload,
			assignedId: payload.assignedTo.value,
			assignedName: payload.assignedTo.label,
			status: 'ongoing',
			dateAssigned: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
			completed: false
		}

		dispatch('fbAddTask', taskToAdd)
	},

	fbAddTask: ({ dispatch, rootGetters }, payload) => {
		const staffId = payload.assignedTo.value
		// must write in 3 places:
		// 1) inside users
		// 2) in tasks
		// 3) notify user
		const docRef = firebaseFs.collection('tasks')

		docRef.add(payload)
			.then(docRef => {
				// decide what data to send
				const notification = {
					from: firebaseAuth.currentUser.displayName,
					to: payload.assignedTo.value,
					subject: 'New Task',
					message: `${payload.document}`,
					details: docRef.path,
					read: false,
					readAt: null,
					createdAt: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
					deleted: false
				}
				dispatch('notifyUser', notification)
				showSuccessMessage()
			})
			.catch(err => showErrorMessage(err.message))
			.finally(() => Loading.hide())
	},

	copyToTask({}, payload) {

	},

	updateTask: ({ dispatch }, payload) => {
		dispatch('fbUpdateTask', payload)
	},

	fbUpdateTask: ({}, payload) => {
		const docs = firebaseFs.collection('tasks').doc(payload.id)

		docs.update(payload.updates)
			.then(() => showSuccessMessage())
			.catch(err => showErrorMessage(err.message))
			.finally(() => Loading.hide())
	},

	deleteTask: ({ dispatch }, id) => {
		dispatch('fbDeleteTask', id)
	},

	fbDeleteTask: ({}, id) => {
		const task = firebaseFs.collection('tasks').doc(id)

		task.update({
			status: 'deleted'
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	},

	notifyUser: ({}, payload) => {
		const doc = firebaseFs.collection('staff').doc(payload.to).collection('notifications')

		doc.add(payload)
			.then(() => console.log('User notified'))
			.catch(err => console.log(err.message))
	},

	completeTask: ({ dispatch }, payload) => {
		dispatch('fbCompleteTask', payload.id)
		if (!!parseDate(payload.rfqDeadline) || payload.forOpening) {
			Loading.show({
				message: 'Adding to for Opening...'
			})
			dispatch('opening/add', payload, { root: true })
		}
	},

	fbCompleteTask: ({}, id) => {
		const task = firebaseFs.collection('tasks').doc(id)

		task.update({
			completed: true,
			dateCompleted: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A'),
			status: 'completed'
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	},

	undoCompleted: ({ dispatch }, payload) => {
		dispatch('fbUndoCompleted', payload)
	},

	fbUndoCompleted: ({}, payload) => {
		const task = firebaseFs.collection('tasks').doc(payload.id)

		task.update({
			status: 'ongoing',
			completed: false,
			dateCompleted: '',
			reason: payload.reason
		})
		.then(() => showSuccessMessage())
		.catch(err => showErrorMessage(err.message))
	},

	remindTask: ({dispatch}, payload) => {
		dispatch('updateTask', {
			id: payload.id,
			updates: {
				reminded: true,
				dateReminded: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
			}
		})
		dispatch('fbRemindTask', payload)
	},

	fbRemindTask: ({ dispatch }, payload) => {
		// notify user
		const notification = {
			from: firebaseAuth.currentUser.displayName,
			to: payload.assignedTo.value,
			subject: 'Reminder',
			message: `${payload.document}`,
			details: `tasks/${payload.id}`,
			read: false,
			readAt: null,
			createdAt: date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
		}
		dispatch('notifyUser', notification)
	}
}

const mutations = {
	ADD_TASK: (state, payload) => {
		Vue.set(state.tasks, payload.id, payload.data)
	},
	UPDATE_TASK: (state, payload) => {
		Vue.set(state.tasks, payload.id, payload.data)
	},
	DELETE_TASK: (state, id) => {
		Vue.delete(state.tasks, id)
	}
}

const getters = {
	ongoing: (state) => {
		let tasks = state.tasks, ongoingTasks = []

		const now = new Date()

		const filteredKeys = Object.keys(tasks).forEach(key => {
			const task = tasks[key]
			const due = now > parseDate(task.dateDue)

			if (!task.completed && task.status === 'ongoing' && !task.deleted) {
				ongoingTasks.push({
					...task,
					overdue: due,
					id: key
				})
			}
		})

		return ongoingTasks
	},
	completed: (state) => {
		let tasks = state.tasks, completedTasks = []

		const filteredKeys = Object.keys(tasks).forEach(key => {
			const task = tasks[key]

			if (task.status === 'completed' && !task.deleted) {
				completedTasks.push({
					...task,
					id: key
				})
			}
		})

		return completedTasks
	},
	deleted: (state) => {
		let tasks = state.tasks, deletedTasks = []

		const filteredKeys = Object.keys(tasks).forEach(key => {
			const task = tasks[key]

			if (task.status === 'deleted') {
				deletedTasks.push({
					...task,
					id: key
				})
			}
		})

		return deletedTasks
	},
	overdue: (state) => {
		const tasks = state.tasks
		let overdueTasks = {}

		Object.keys(tasks).forEach(key => {
			const task = tasks[key]
			const dateDue = task.dateDue ? new Date(parseDate(task.dateDue)) : ''
			const today = new Date()

			if (dateDue && today > dateDue && !task.completed) {
				overdueTasks[key] = task
			}
		})

		return overdueTasks
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
