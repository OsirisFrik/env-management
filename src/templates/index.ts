import firebase from 'firebase/app'
import 'firebase/auth'

if (!process.env.ENV_MANAGEMENT_FIREBASE_CONFIG) throw new Error('Missing FIREBASE_CONFIG')

console.log(process.env.ENV_MANAGEMENT_FIREBASE_CONFIG)

const config = JSON.parse(process.env.ENV_MANAGEMENT_FIREBASE_CONFIG)

firebase.initializeApp(config)

const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()

auth.onAuthStateChanged(async user => {
  if (user) {
    const tokenId =await user.getIdToken()

    window.location.replace(`/auth?token_id=${tokenId}`)
  } else {
    console.log('User is signed out.')
    login()
  }
})

function login() {
  auth.signInWithRedirect(provider).catch(error => console.error(error))
}
