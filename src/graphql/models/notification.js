import gql from 'graphql-tag'

export const NOTIFICATION_FRAGMENT = gql`
	fragment notificationFragment on Notification {
		id
		notifiable {
			id
			name
			email
		}
		data {
			from
			type
			title
			body
			actionText
			actionUrl
		}
		created_at
	}
`

export const NOTIFICATIONS = gql`
	query {
		notifications {
			...notificationFragment
		}
	}
	${NOTIFICATION_FRAGMENT}
`

export const UNREAD_NOTIFICATIONS = gql`
	query {
		unreadNotifications {
			...notificationFragment
		}
	}
	${NOTIFICATION_FRAGMENT}
`
