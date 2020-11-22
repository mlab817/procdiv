import gql from 'graphql-tag'

export const REQUEST_TYPE_FRAGMENT = gql`
	fragment requestTypeFragment on RequestType {
		id
		name
		slug
	}
`

export const REQUEST_TYPES = gql`
	query {
		request_types {
			...requestTypeFragment
		}
	}
	${REQUEST_TYPE_FRAGMENT}
`

export const REQUEST_TYPE = gql`
	query ($id: ID!) {
		request_type (id: $id) {
			...requestTypeFragment
		}
	}
	${REQUEST_TYPE_FRAGMENT}
`
