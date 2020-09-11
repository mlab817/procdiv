// import something here
import { LocalStorage } from 'quasar'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ router }) => {
  router.beforeEach((to, from, next) => {
  	const loggedIn = LocalStorage.getItem('loggedIn') || false
  	if (!loggedIn && to.path !== '/auth') {
  		next('/auth')
  	}
  	else if (loggedIn && to.path === '/auth') {
  		next('/')
  	}
  	else {
	    next()
  	}
  })
}
