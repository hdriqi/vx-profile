require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const Database = require('./db')
const Ctl = require('./controllers')
const Worker = require('./worker')

const init = async () => {
  const database = new Database()
  await database.init()

  const ctl = new Ctl(database)
  await ctl.init()
  
  const worker = new Worker(ctl)
  await worker.init()

  const app = express()

  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  const authVerifyTokenMiddleware = async (req, res, next) => {
    const payload = {
      accessToken: req.headers['authorization']
    }

    const response = await worker.authVerifyToken(payload)

    if(response.status === 'success') {
      req.userUid = response.data.userUid
      return next()
    }

    return res.json(response)
  }

  const authVerifyClientMiddleware = async (req, res, next) => {
    const payload = {
      clientId: req.headers['x-client-id'],
      clientSecret: req.headers['x-client-secret']
    }

    const response = await worker.authVerifyClient(payload)

    if(response.status === 'success') {
      return next()
    }

    return res.json(response)
  }

  app.get('/', (req, res) => {
    res.json({
      status: 'success',
      data: {
        message: 'service is up and running'
      }
    })
  })

  app.post('/kyc', authVerifyClientMiddleware, authVerifyTokenMiddleware, async (req, res) => {
    const payload = {
      userUid: req.userUid,
      ...req.body
    }
    const response = await ctl.saveKYC(payload)
    res.json(response)
  })

  app.get('/kyc', authVerifyClientMiddleware, authVerifyTokenMiddleware, async (req, res) => {
    const payload = {
      userUid: req.userUid
    }
    const response = await ctl.getKYC(payload)
    res.json(response)
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
}

init()