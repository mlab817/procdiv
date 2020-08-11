import { firebaseAuth, provider, firebaseFs } from 'boot/firebase'
import { Loading, LocalStorage } from 'quasar'
import { showSuccessMessage, showErrorMessage } from 'src/functions/show-messages'

export function login({}, payload) {
	Loading.show()
	firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
		.then(res => {
			showSuccessMessage()
		})
		.catch(err => {
			showErrorMessage()
			Loading.hide()
		})
}

export function logout({}) {
	firebaseAuth.signOut()
}

export function getUserProfile({ commit }, user) {
  const userRef = firebaseFs.collection('users').doc(user.uid)
  const { email, displayName, photoURL, uid } = user

  userRef
  	.get()
  	.then(doc => {
  		if (doc.exists) {
  			commit('SET_USER', doc.data())
  			console.log(doc.data())
  		} else {
  			let newUser = {}
  			newUser.email = email
  			newUser.displayName = displayName
  			newUser.photoURL = photoURL
  			newUser.uid = uid
  			newUser.role = 'user'

  			userRef.set(newUser)
  				.then(() => showSuccessMessage())
  				.catch(err => showErrorMessage(err.message))
  		}
  	})

}

export function googleSignIn({dispatch}) {
	firebaseAuth
		.signInWithPopup(provider)
		.then(res => {
			const token = res.credential.accessToken
			const user = res.user

			console.log(token, user)
		})
		.catch(err => {
			const errorCode = err.code
			const errorMessage = err.message
			const email = err.email
			const credential = err.credential

			console.error(errorCode, errorMessage, email, credential)
		})
}

export function handleAuthStateChanged({ commit, dispatch }) {
	firebaseAuth.onAuthStateChanged(user => {
		Loading.hide()
		if (user) {
      dispatch('getUserProfile', user)
			commit('SET_LOGGED_IN', true)
			LocalStorage.set('loggedIn', true)
			this.$router.push('/').then(() => console.log('next')).catch(err => console.log(err.message))
			// dispatch('assignment/fbReadData', null, { root: true })
			dispatch('assignment/fsReadData', null, { root: true })
	  	// dispatch('document/fbReadData', null, { root: true })
	  	// dispatch('staff/fbReadData', null, { root: true })
	  	// dispatch('enduser/fbReadData', null, { root: true })
	  	dispatch('staff/fsReadData', null, { root: true })
	  	dispatch('document/fsReadData', null, { root: true })
	  	dispatch('enduser/fsReadData', null, { root: true })
		} else {
			// commit('assignment/CLEAR_ASSIGNMENTS', null, { root: true })
			commit('assignment/SET_DOWNLOADED', null, { root: true })
			commit('CLEAR_USER')
			commit('SET_LOGGED_IN', false)
			LocalStorage.set('loggedIn', false)
			this.$router.replace('/auth').then(() => console.log('next')).catch(err => console.log(err.message))
		}
	})
}