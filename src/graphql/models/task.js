import gql from 'graphql-tag'

export const TASK_FRAGMENT = gql`
	fragment taskFragment on Task {
		id
		action_id
		action {
			id
			name
		}
		staff_id
		staff {
			id
			name
		}
		completed
		enduser_id
		enduser {
			id
			name
		}
		details
		remarks
		status_id
		status {
			id
			name
		}
		completed_at
		creator {
			id
			name
		}
		updater {
			id
			name
		}
		deleter {
			id
			name
		}
		created_at
		updated_at
		deleted_at
		procurement_requests {
			id
		}
	}
`

export const TASKS = gql`
	query {
		tasks {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const TASK = gql`
	query ($id: ID!) {
		task (id: $id) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const CREATE_TASK = gql`
	mutation (
		$action_id: ID
		$procurement_requests: CreateProcurementRequestsBelongsToMany
		$details: String
		$remarks: String
		$staff_id: ID
	) {
		createTask(input: {
			action_id: $action_id
			procurement_requests: $procurement_requests
			details: $details
			remarks: $remarks
			staff_id: $staff_id
		}) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const UPDATE_TASK = gql`
	mutation (
		$id: ID!
		$action_id: ID
		$procurement_requests: UpdateProcurementRequestsBelongsToMany
		$details: String
		$remarks: String
		$staff_id: ID
	) {
		updateTask(input: {
			id: $id
			action_id: $action_id
			procurement_requests: $procurement_requests
			details: $details
			remarks: $remarks
			staff_id: $staff_id
		}) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const DELETE_TASK = gql`
	mutation (
		$id: ID!
	) {
		deleteTask(id: $id) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const COMPLETE_TASK = gql`
	mutation (
		$id: ID!
	) {
		completeTask(id: $id) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`

export const CANCEL_TASK = gql`
	mutation (
		$id: ID!
	) {
		cancelTask(id: $id) {
			...taskFragment
		}
	}
	${TASK_FRAGMENT}
`
