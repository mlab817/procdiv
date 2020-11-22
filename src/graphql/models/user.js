import gql from 'graphql-tag'
import { PAGINATOR_INFO_FRAGMENT } from 'src/graphql/models/paginator_info'

export const USER_FRAGMENT = gql`
	fragment userFragment on User {
		id
		name
		email
	}
`

export const USERS = gql`
	query (
		$first: Int!
		$page: Int!
	) {
		users (
			first: $first
			page: $page
		) {
			data {
				...userFragment
			}
			paginatorInfo {
				...paginatorInfoFragment
			}
		}
	}
	${USER_FRAGMENT}
	${PAGINATOR_INFO_FRAGMENT}
`

export const USER = gql`
	query ($id: ID) {
		user (id: $id) {
			...userFragment
		}
	}
	${USER_FRAGMENT}
`
