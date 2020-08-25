<template>
	<q-page padding>
		<q-card style="width: 400px; max-width: 80wh;">
			<q-card-section>
				<div class="text-h6">Notifications</div>
			</q-card-section>
			<q-card-section>
				<q-item v-for="(notification, key) in notifications" :key="key" clickable @click="goTo(`/${notification.details}`)">
					<q-item-section avatar>
						<q-avatar class="bg-primary text-white">
							{{notification.from.charAt(0)}}
						</q-avatar>
					</q-item-section>
					<q-item-section>
						<q-item-label>{{notification.subject}} - </q-item-label>
						<q-item-label>{{notification.message}}</q-item-label>
						<q-item-label caption>{{notification.createdAt | timeElapsed }}</q-item-label>
					</q-item-section>
					<q-item-section side top>
						<q-btn icon="delete" flat round dense @click.capture.stop="deleteItem(key)" color="negative" />
					</q-item-section>
				</q-item>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script>
	import { timeAgo } from 'src/functions'

	export default {
		name: 'NotificationsPage',
		
		computed: {
			notifications() {
				return this.$store.getters['notification/all']
			}
		},

		methods: {
			deleteItem(id) {
				this.$q.dialog({
					title: 'Confirm Delete',
					message: 'Are you sure you want to delete notification?',
					cancel: true,
					persistent: true
				}).onOk(() => this.$store.dispatch('notification/deleteNotification', id))
			},
			goTo(link) {
				this.$router.push(link)
			}
		},

		filters: {
			timeElapsed(val) {
				if (val) {
					return timeAgo(val)
				}
				return ''
			}
		}
	}
</script>