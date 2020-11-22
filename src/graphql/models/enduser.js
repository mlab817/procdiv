import gql from 'graphql-tag'

export const ENDUSER_FRAGMENT = gql`
	fragment enduserFragment on Enduser {
		id
		name
		acronym
		slug
		procurement_coordinator
		created_at
		updated_at
	}
`

export const ENDUSERS = gql`
	query {
		endusers {
			id
			name
			acronym
			slug
			procurement_coordinator
			created_at
			updated_at
		}
	}
`

export const ENDUSER = gql`
	query ($id: ID!) {
		enduser (id: $id) {
			id
			name
			acronym
			slug
			procurement_coordinator
			created_at
			updated_at
		}
	}
`
