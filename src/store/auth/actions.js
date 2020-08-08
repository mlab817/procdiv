import { firebaseAuth } from 'boot/firebase'
import { Loading, LocalStorage } from 'quasar'

export function login({}, payload) {
	Loading.show()
	firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
		.then(res => {
			console.log(res)
		})
		.catch(err => {
			console.log(err.message)
		})
}

export function logout({}) {
	firebaseAuth.signOut()
}

export function handleAuthStateChanged({ commit, dispatch }) {
	firebaseAuth.onAuthStateChanged(user => {
		Loading.hide()
		if (user) {
			commit('SET_LOGGED_IN', true)
			LocalStorage.set('loggedIn', true)
			this.$router.push('/').then(() => console.log('next')).catch(err => console.log(err.message))
			dispatch('assignment/fbReadData', null, { root: true })
		} else {
			commit('assignment/CLEAR_ASSIGNMENTS', null, { root: true })
			commit('assignment/SET_DOWNLOADED', null, { root: true })
			commit('SET_LOGGED_IN', false)
			LocalStorage.set('loggedIn', false)
			this.$router.replace('/auth').then(() => console.log('next')).catch(err => console.log(err.message))
		}
	})
}