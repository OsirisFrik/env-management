import fadmin from 'firebase-admin'
import firebase from 'firebase/app'
import { loginUser } from './libs/auth'
import { loadProjects } from './libs/projects'
import './tools/config'

const firebaseConfig = JSON.parse(process.env.ENV_MANAGEMENT_FIREBASE_CONFIG || '')

fadmin.initializeApp({
  credential: fadmin.credential.applicationDefault()
})
const app = firebase.initializeApp(firebaseConfig)

async function init() {
  try {
    await loginUser(app)
    await loadProjects(app)

    console.log('end!')
    process.exit(0)
  } catch (err) {
    console.trace(err)
    process.exit(1)
  }
}

console.log('start')
init()
