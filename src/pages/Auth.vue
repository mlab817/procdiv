<template>
  <q-page padding>
    <q-card class="login" square flat bordered>
      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" class="bg-primary text-white">
          <q-tab name="login" label="Login"></q-tab>
          <q-tab name="register" label="Register"></q-tab>
        </q-tabs>
        <q-separator/>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <q-form greedy class="q-gutter-md" ref="login" @submit.prevent="handleSubmit" @reset="resetForm">

              <q-item-label header class="q-pa-none text-h6 text-weight-bold text-black">Login</q-item-label>

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
                :type="visiblePassword ? 'text' : 'password'" 
                placeholder="********" 
                label="Password" 
                stack-label
                :rules="[ val => !!val || '* Required' ]"
                hide-bottom-space 
                @keyup.enter="submitForm">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" :name="visiblePassword ? 'visibility_off' : 'visibility'" @click="visiblePassword = !visiblePassword"/>
                </template>
              </q-input>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="register">
            <q-form greedy class="q-gutter-md" ref="register" @submit.prevent="handleSubmit" @reset="resetForm">

              <q-item-label header class="q-pa-none text-h6 text-weight-bold text-black">Register</q-item-label>

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
                  :type="visiblePassword ? 'text' : 'password'" 
                  placeholder="********" 
                  label="Password" 
                  stack-label
                  :rules="[ val => !!val || '* Required' ]"
                  hide-bottom-space 
                  @keyup.enter="submitForm"
                >
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" :name="visiblePassword ? 'visibility_off' : 'visibility'" @click="visiblePassword = !visiblePassword"/>
                  </template>
                </q-input>

              </q-form>
          </q-tab-panel>
        </q-tab-panels>
        <div class="row q-px-md justify-between">
          <div class="col q-mr-md">
            <q-btn
              class="full-width"
              outline
              color="primary"
              @click="handleReset">
              Reset
            </q-btn>
          </div>

          <div class="col">
            <q-btn
              class="full-width"
              color="primary"
              @click="submitForm">
              Submit
            </q-btn>
          </div>
        </div>
      </q-card-section>
      
      <q-separator spaced />
      <q-card-section>
        <q-btn 
          icon="img:https://www.gstatic.com/mobilesdk/160512_mobilesdk/auth_service_google.svg" 
          class="full-width" 
          color="red" 
          label="Log in with Google" 
          @click="googleSignIn" />
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
  		password: '',
      displayName: '',
      tab: 'login',
      visiblePassword: false
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
      if (this.tab === 'login') {
        this.$refs.login.reset()
      } else {
        this.$refs.register.reset()
      }
    },
  	resetForm() {
      this.displayName = ''
  		this.email = ''
  		this.password = ''
  	},
    submitForm() {
      if (this.tab === 'login') {
        // trigger login
        this.$refs.login.validate().then(success => {
          if (success) {
            const payload = {
              email: this.email,
              password: this.password
            }
            this.$store.dispatch('auth/login', payload)
          } else {
            alert('Review form inputs.')
          }
        })
        
      }
      if (this.tab === 'register') {
        this.$refs.register.validate().then(success => {
          if (success) {
            const payload = {
              displayName: this.displayName,
              email: this.email,
              password: this.password
            }
            this.$store.dispatch('auth/register', payload)
          } else {
            alert('Review form inputs.')
          }
          
        })
        
      }
    },
    googleSignIn() {
      this.$store.dispatch('auth/googleSignIn')
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