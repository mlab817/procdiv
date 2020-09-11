export function unread(state) {
	const notifications = state.notifications
	let unreadNotifications = {}

	Object.keys(notifications).forEach(key => {
		const notification = notifications[key]

		if (!notification.read) {
			unreadNotifications[key] = notification
		}
	})

	return unreadNotifications
}

export function all(state, getters) {
	return getters.sorted
}

export function sorted(state) {
	let notifications = state.notifications,
		keysOrdered = Object.keys(notifications),
		sortedNotifications = {}

	keysOrdered.sort((a, b) => {
		let taskAProp = notifications[a].createdAt,
			taskBProp = notifications[b].createdAt

		if (taskAProp > taskBProp) return -1
		else if (taskAProp < taskBProp) return 1
		else return 0
	})

	keysOrdered.forEach(key => {
		sortedNotifications[key] = notifications[key]
	})

	return sortedNotifications
}