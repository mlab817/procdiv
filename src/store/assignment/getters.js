import { date } from 'quasar'

export function completed(state, getters) {
	const filteredAssignments = getters.filtered
	let completedAssignments = {}

	Object.keys(filteredAssignments).forEach(key => {
		let assignment = filteredAssignments[key]
		if (typeof assignment.dateCompleted !== 'undefined' && assignment.dateCompleted !== null && assignment.dateCompleted !== '') {
			completedAssignments[key] = assignment
		}
	})

	return completedAssignments
}

export function ongoing(state, getters) {
	const filteredAssignments = getters.filtered
	let ongoingAssignments = {}

	Object.keys(filteredAssignments).forEach(key => {
		const assignment = filteredAssignments[key]
		if (typeof assignment.dateCompleted === 'undefined' || assignment.dateCompleted === null || assignment.dateCompleted === '') {
			ongoingAssignments[key] = assignment
		}
	})

	return ongoingAssignments
}

export function filtered(state, getters) {
	const sortedAssignments = getters.sorted
	let filteredAssignments = []

	const search = state.search && state.search.toLowerCase()

	if (search) {
		Object.keys(sortedAssignments).forEach(key => {
			const assignment = state.assignments[key]

			const doc = assignment.document && assignment.document.toLowerCase()
			const par = assignment.particulars && assignment.particulars.toLowerCase()
			const eu = assignment.enduser && assignment.enduser.toLowerCase()
			const rn = assignment.referenceNo && assignment.referenceNo.toLowerCase()
			const at = assignment.assignedTo && assignment.assignedTo.toLowerCase()
			const rm = assignment.remarks && assignment.remarks.toLowerCase()

			if (doc.includes(search) 
					|| par.includes(search)
					|| eu.includes(search)
					|| rn.includes(search)
					|| at.includes(search)
					|| rm.includes(search)) {
				filteredAssignments[key] = assignment
			}
		})
		return filteredAssignments
	}
	return sortedAssignments
}

export function sorted(state, getters) {
	let sortedAssignments = {},
			keysOrdered = Object.keys(state.assignments)

	keysOrdered.sort((a,b) => {
		const assignmentAProp = state.assignments[a][state.sortBy] && state.assignments[a][state.sortBy].toLowerCase(),
				assignmentBProp = state.assignments[b][state.sortBy] && state.assignments[b][state.sortBy].toLowerCase()

		if (assignmentAProp > assignmentBProp) return 1
		else if (assignmentAProp < assignmentBProp) return -1
		else return 0
	})

	keysOrdered.forEach((key) => {
		sortedAssignments[key] = state.assignments[key]
	})

	return sortedAssignments
}

export function friendlyDate(state) {
	const assignments = state.assignments

	let friendlyDate = []

	Object.keys(assignments).forEach(key => {
		friendlyDate.push({
			...assignments[key],
			assignedAt: date.formatDate(assignments[key].dateAssigned,'YYYY-MM-DD')
		})
	})

	return friendlyDate
}