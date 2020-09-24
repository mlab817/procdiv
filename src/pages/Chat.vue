<template>
  <q-page padding>
    <div class="row q-mt-md">
    	<div class="col-3">
    		<div class="text-h5">Chat <q-badge color="negative">New in v2.2</q-badge></div>
    		<q-input v-model="search" outlined rounded dense class="q-my-sm" placeholder="Search">
    			<template v-slot:prepend>
	          <q-icon name="search" />
	        </template>
    		</q-input>
    		<q-list bordered separator class="q-mt-md">
    			<q-item v-for="(user, key) in users" :key="key" clickable :to="`/chat/${key}`">
    				<q-item-section avatar>
    					<q-avatar>
    						<q-img :src="user.photoURL" />
    					</q-avatar>
    				</q-item-section>
    				<q-item-section>
    					<q-item-label>{{user.displayName}}</q-item-label>
    					<q-item-label caption>{{user.email}}</q-item-label>
    				</q-item-section>
    			</q-item>
    		</q-list>
    	</div>
    	<div class="col-9">
	    <div class="q-pa-md row justify-center">
		    <div>
		      <q-chat-message
		        name="<span class='text-positive'>Trusted Source</span>"
		        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
		        :text="['hey, how are <strong>you</strong>?']"
		        stamp="7 minutes ago"
		        sent
		        bg-color="amber-7"
		      />
		      <q-chat-message
		        name="<span class='text-negative'>Jane (untrusted text but trusted name)</span>"
		        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
		        :text="[
		          'doing fine, how r you?',
		          'I just feel like typing a really, really, <strong>REALLY</strong> long message to annoy you...'
		        ]"
		        text-sanitize
		        size="6"
		        stamp="4 minutes ago"
		        text-color="white"
		        bg-color="primary"
		      />
		      <q-chat-message
		        name="<span class='text-negative'>Jao (untrusted)</span>"
		        name-sanitize
		        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
		        :text="['<strong>Did it work?</strong>']"
		        text-sanitize
		        stamp="1 minutes ago"
		        size="8"
		        text-color="white"
		        bg-color="primary"
		      />
		      <q-input
		      	class="q-mt-md"
		      	filled
		      	type="textarea"
		      	placeholder="Write something..."
		      	v-model="message"></q-input>
		    </div>
		  </div>
	  </div>
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageChat',
  computed: {
  	messages() {
  		return []
  	},
  	users() {
  		return this.$store.state.user.users
  	}
  },
  data() {
  	return {
  		message: ''
  	}
  }
}
</script>
