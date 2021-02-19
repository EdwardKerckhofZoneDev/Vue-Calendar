import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyAAcZBbzKG88zdcF7i6_66jIoOYIEgqfjc',
  authDomain: 'vue-calendar-50bab.firebaseapp.com',
  projectId: 'vue-calendar-50bab',
  storageBucket: 'vue-calendar-50bab.appspot.com',
  messagingSenderId: '899315315757',
  appId: '1:899315315757:web:98eeb1ff739222c055b4a4'
})

export const db = firebase.storage()
export default firebase
