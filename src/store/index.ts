import Configstore from 'configstore'

const pkg = require('../../package.json')
const name = pkg.name

interface Config {
  token: string
  tokenId: string
  projects: string[]
  uid: string
}

export default new Configstore<Config>(name)
