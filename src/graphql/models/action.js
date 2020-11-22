import gql from 'graphql-tag'

export const ACTION_FRAGMENT = gql`
	fragment actionFragment on Action {
		id
		name
		slug
	}
`

export const ACTIONS = gql`
	query {
		actions {
			...actionFragment
		}
	}
	${ACTION_FRAGMENT}
`

export const ACTION = gql`
	query ($id: ID!) {
		action (id: $id) {
			...actionFragment
		}
	}
	${ACTION_FRAGMENT}
`
