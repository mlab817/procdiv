import gql from 'graphql-tag'

export const RFQ_FRAGMENT = gql`
	fragment rfqFragment on Rfq {
		id
		number
		name
		created_at
		updated_at
	}
`

export const RFQS = gql`
	query {
		rfqs {
			...rfqFragment
		}
	}
	${RFQ_FRAGMENT}
`

export const RFQ = gql`
	query ($id: ID!) {
		rfq (id: $id) {
			...rfqFragment
		}
	}
	${RFQ_FRAGMENT}
`
