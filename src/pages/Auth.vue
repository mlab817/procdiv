<template>
  <q-page padding>
    <q-card class="login" square flat bordered>
    	<q-card-section class="bg-primary text-white">
    		<div class="text-h6">Login</div>
    	</q-card-section>
    	<q-card-section>
    		<q-form greedy class="q-gutter-md" ref="login-form" @submit.prevent="handleSubmit" @reset="handleReset">
    			<q-input 
    				v-model="email"
    				outlined 
    				type="email" 
    				placeholder="user@example.com" 
    				label="Email" 
    				stack-label
    				:rules="[ val => !!val || '* Required' ]"
    				hide-bottom-space />

    			<q-input 
    				v-model="password"
    				outlined 
    				type="password" 
    				placeholder="********" 
    				label="Password" 
    				stack-label
    				:rules="[ val => !!val || '* Required' ]"
    				hide-bottom-space />

    			<div class="row justify-between">
    				<div class="col q-mr-md">
	    				<q-btn
		    				type="reset"
		    				class="full-width"
		    				flat
		    				color="primary">
	    					Reset
	    				</q-btn>
    				</div>

    				<div class="col">
	    				<q-btn
		    				type="submit"
		    				class="full-width"
		    				color="primary">
	    					Submit
	    				</q-btn>
    				</div>
    			</div>
    			
    		</q-form>
    	</q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageAuth',
  data() {
  	return {
  		email: '',
  		password: ''
  	}
  },
  methods: {
  	handleSubmit() {
  		this.$store.dispatch('auth/login', {
  			email: this.email,
  			password: this.password
  		})
  	},
  	handleReset() {
  		this.email = ''
  		this.password = ''
  	}
  }
}
</script>

<style>
	.login {
		margin: 0 auto;
		max-width: 480px;
	}
</style>