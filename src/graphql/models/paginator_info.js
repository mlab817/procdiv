import gql from 'graphql-tag'

export const PAGINATOR_INFO_FRAGMENT = gql`
	fragment paginatorInfoFragment on PaginatorInfo {
		count
		currentPage
		firstItem
		hasMorePages
		lastItem
		lastPage
		perPage
		total
	}
`
