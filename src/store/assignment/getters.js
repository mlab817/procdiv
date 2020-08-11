import { date } from 'quasar'
import { parseDate } from 'src/functions/parse-date'

export function completed(state, getters) {
	const filteredAssignments = getters.filtered
	let completedAssignments = {}

	Object.keys(filteredAssignments).forEach(key => {
		let assignment = filteredAssignments[key]
		if (assignment.status !== undefined && assignment.status === 'completed') {
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
		if (assignment.status === undefined || assignment.status === 'ongoing') {
			ongoingAssignments[key] = assignment
		}
	})

	return ongoingAssignments
}

export function deleted(state, getters) {
	const filteredAssignments = getters.filtered
	let deletedAssignments = {}

	Object.keys(filteredAssignments).forEach(key => {
		const assignment = filteredAssignments[key]
		if (assignment.status !== undefined && assignment.status === 'deleted') {
			deletedAssignments[key] = assignment
		}
	})

	return deletedAssignments
}

export function filtered(state, getters) {
	const sortedAssignments = getters.filteredByDate
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

export function filteredByDate(state, getters) {
	const start = state.start
	const end = state.end
	let filteredByDate = {}

	const assignments = getters.sorted

	console.log(Object.keys(assignments).length)

	if (!start && !end) {
		console.log('no dates selected')
		return  assignments
	} else if (start && !end) {
		Object.keys(assignments).forEach(key => {
			const assignment = assignments[key]
			const dateAssigned = new Date(parseDate(assignment.dateAssigned))

			if (dateAssigned && date.isSameDate(dateAssigned, start, 'day')) {
				filteredByDate[key] = assignment
			}
		})
		return filteredByDate
	} else {
		Object.keys(assignments).forEach(key => {
			const assignment = assignments[key]
			const dateAssigned = new Date(parseDate(assignment.dateAssigned))

			if (dateAssigned && date.isBetweenDates(dateAssigned, start, end, { onlyDate: true, inclusiveFrom: true, inclusiveTo: true })) {
				filteredByDate[key] = assignment
			}
		})
		return filteredByDate
	}
}

export function sorted(state, getters) {
	let sortedAssignments = {},
			keysOrdered = Object.keys(state.assignments)

	const sortBy = state.sortBy, sortDir = state.sortDir

	keysOrdered.sort((a,b) => {
		let assignmentAProp = null,
			assignmentBProp = null
		if (sortBy === 'dateAssigned' || sortBy === 'dateDue') {
			assignmentAProp = state.assignments[a][sortBy] && new Date(parseDate(state.assignments[a][sortBy]))
			assignmentBProp = state.assignments[b][sortBy] && new Date(parseDate(state.assignments[b][sortBy]))	
		} else {
			assignmentAProp = state.assignments[a][sortBy] && state.assignments[a][sortBy].toLowerCase()
			assignmentBProp = state.assignments[b][sortBy] && state.assignments[b][sortBy].toLowerCase()	
		}

		if (sortDir === 'asc') {
			if (assignmentAProp > assignmentBProp) return 1
			else if (assignmentAProp < assignmentBProp) return -1
			else return 0
		} else {
			if (assignmentAProp > assignmentBProp) return -1
			else if (assignmentAProp < assignmentBProp) return 1
			else return 0
		}
			
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
			assignedAt: date.formatDate(parseDate(assignments[key].dateAssigned),'YYYY-MM-DD')
		})
	})

	return friendlyDate
}