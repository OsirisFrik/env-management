import Debug from 'debug'
import firebase from 'firebase'
import 'firebase/firestore'

const debug = Debug('app:projects')

export async function loadProjects(app: firebase.app.App) {
  console.log(firebase.auth(app).currentUser!.uid)

  const db = firebase.firestore(app)
  const projects = await db.collection('projects')
    .where('users', 'array-contains', firebase.auth(app).currentUser!.uid)
    .get()
  
  return 
}
