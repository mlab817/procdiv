<template>
	<q-list>
    <template v-if="Object.keys(notifications).length">
      <q-item v-for="(notification, key) in notifications" :key="key" clickable @mouseover="hover = key" @mouseleave="hover = null" @click="goTo(`/${notification.details}`)">
        <q-item-section avatar>
          <q-avatar class="bg-primary text-white">{{notification.from.charAt(0)}}</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span class="text-weight-bolder">[{{notification.subject}}] - </span>
            {{notification.message}}
          </q-item-label>
          <q-item-label caption :class="notification.read ? 'text-grey-5' : 'text-primary'">
            {{timeAgo(notification.createdAt)}}
          </q-item-label>
        </q-item-section>
        <q-item-section top side v-if="!notification.read && hover == key">
          <q-btn icon="done" flat round dense @click.stop="markAsRead(key)"></q-btn>
        </q-item-section>
      </q-item>
    </template>
    <q-item v-else>
      <q-item-section avatar>
        <q-avatar class="bg-negative text-white">?</q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>No new notifications.</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
	import { timeAgo } from 'src/functions'

	export default {
		name: 'NotificationsList',
		computed: {
			notifications() {
				return this.$store.getters['notification/unread']
			}
		},
		data() {
			return {
				hover: false
			}
		},
		methods: {
			markAsRead(key) {
	      this.$store.dispatch('notification/markAsRead', key)
	    },
	    goTo(link) {
	    	this.$router.push(link)
	    },
	    timeAgo
		}
	}
</script>

<style scoped>
	
</style>