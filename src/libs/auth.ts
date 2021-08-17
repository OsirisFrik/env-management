import fadmin from 'firebase-admin'
import http from 'http'
import portFinder from 'portfinder'
import open from 'open'
import fs from'fs'
import path from 'path'
import Debug from 'debug'
import clc from 'cli-color'
import qs from 'qs'
import jwt from 'jsonwebtoken'
import store from '../store'
import firebase from 'firebase/app'
import 'firebase/auth'

interface TOKEN_DATA {
  uid: string
  exp: number,
  authTime: number
}

const debug = Debug('app:auth')
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'DEFAULT_SECRET'
let APP: firebase.app.App

async function createServer(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const port = await portFinder.getPortPromise()
    const server = http.createServer(async (req, res) => {
      debug(req.url)

      try {
        if(req.url?.startsWith('/auth?token_id')) {
          res.write('login success. Now you can close this page')
          res.end()
  
          const query: { [key: string]: any } = qs.parse(req.url?.split('?').pop() || '')
          debug(query)

          server.close()

          return resolve(query.token_id)
        }
  
        if (req.url?.endsWith('.js')) {
          const index = fs.readFileSync(path.join(__dirname, `../../templates${req.url}`))
  
          res.writeHead(200)
          res.end(index)
  
          return
        }
  
        if (req.url === '/') {
          const index = fs.readFileSync(path.join(__dirname, '../../templates/index.html'))
  
          res.writeHead(200)
          res.end(index)
  
          return
        }
      } catch (err) {
        debug(err)
        throw err
      }
    })

    server.listen(port)
    server.on('error', (err) => {
      server.close()

      reject(err)
    })

    console.info()
    console.info('Visit this URL on any device to log in:')
    console.info(clc.bold.underline(`http://locallhost:${port}/`))

    await open(`http://localhost:${port}`, { wait: true })
  })
}

async function validateTokenId(tokenId: string): Promise<string> {
  try {
    const tokenData = await fadmin.auth().verifyIdToken(tokenId)

    store.set('tokenId', tokenId)
    store.set('uid', tokenData.uid)

    return tokenData.uid
  } catch (err) {
    throw err
  }
}

async function createCustomToken(uid: string): Promise<string> {
  return await fadmin.auth().createCustomToken(uid)
}

async function authUser(): Promise<string> {
  const token = await createServer()
  const uid = await validateTokenId(token)

  const userProfile = fadmin.firestore()
    .collection('users')
    .doc(uid)
  const userProfileDoc = await userProfile.get()

  if (!userProfileDoc.exists) {
    const userData = await fadmin.auth().getUser(uid)

    userProfile.set({
      uid: uid,
      displayName: userData.displayName,
      email: userData.email,
      avatar: userData.photoURL
    })
  }

  return createCustomToken(uid)
}

export async function loginUser(app: firebase.app.App) {
  APP = app

  try {
    const tokenId = store.get('tokenId') as string
    let token
      
    if (!tokenId) {
      token = await authUser()
    } else {
      try {
        let uid = await validateTokenId(tokenId)
        token = await createCustomToken(uid)
      } catch (err) {
        console.trace(err)

        const errors = [
          'auth/invalid-custom-token',
          'auth/argument-error',
          'auth/id-token-expired'
        ]
        if (errors.includes(err.code)) token = await authUser()
      }
    }

    if (!token) throw new Error('no token')

    const user = await firebase.auth().signInWithCustomToken(token)

    console.log(`Hi ${clc.bold.cyan(user.user?.displayName)}`)
  } catch (err) {
    console.trace(err)
  }
}
