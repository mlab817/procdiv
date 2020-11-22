import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

import { firebaseConfig } from '../config'

import { showErrorMessage } from 'src/functions/show-messages'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.database()
const firebaseFs = firebaseApp.firestore()

const provider = new firebase.auth.GoogleAuthProvider()

// enable persistence for firestore
firebaseFs.enablePersistence()
	.catch(err => {
		if (err.code == 'failed-precondition') {
			showErrorMessage('Offline mode does not support multiple tabs')
		} else if (err.code == 'unimplemented') {
			showErrorMessage('The current browser does not support offline mode')
		}
	});

export { 
	firebaseApp, 
	firebaseAuth, 
	firebaseDb, 
	firebaseFs, 
	provider
}