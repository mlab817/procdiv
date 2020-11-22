import gql from 'graphql-tag'

export const STATUS_FRAGMENT = gql`
	fragment statusFragment on Rfq {
		id
		name
		created_at
		updated_at
	}
`

export const STATUSES = gql`
	query {
		statuses {
			...statusFragment
		}
	}
	${STATUS_FRAGMENT}
`

export const RFQ = gql`
	query ($id: ID!) {
		status (id: $id) {
			...statusFragment
		}
	}
	${STATUS_FRAGMENT}
`
