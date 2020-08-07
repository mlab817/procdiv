import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBo6tER2OUthEOw-K_57A6RpaQH-f7BJY4",
  authDomain: "pms-tasker.firebaseapp.com",
  databaseURL: "https://pms-tasker.firebaseio.com",
  projectId: "pms-tasker",
  storageBucket: "pms-tasker.appspot.com",
  messagingSenderId: "64885691054",
  appId: "1:64885691054:web:cec9253cf5a6ffb58bd33f",
  measurementId: "G-R2QLZX8M0X"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.database()

export { firebaseAuth, firebaseDb }