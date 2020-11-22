import gql from 'graphql-tag'

export const PROCUREMENT_REQUEST_FRAGMENT = gql`
	fragment procurementRequestFragment on ProcurementRequest {
		id
		number
		details
		abc
		enduser_id
		enduser {
			id
			name
		}
		created_at
		updated_at
	}
`

export const PROCUREMENT_REQUESTS = gql`
	query {
		procurement_requests {
			...procurementRequestFragment
		}
	}
	${PROCUREMENT_REQUEST_FRAGMENT}
`

export const PROCUREMENT_REQUEST = gql`
	query ($id: ID!) {
		procurement_request (id: $id) {
			...procurementRequestFragment
		}
	}
	${PROCUREMENT_REQUEST_FRAGMENT}
`
