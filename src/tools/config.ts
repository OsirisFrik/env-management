if (process.env.NODE_ENV !== 'development') {
  const config = require('../../config.json')

  for (const key in config) {
    process.env[key] = config[key]
  }
}

