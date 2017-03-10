'use strict'

const Koa = require('koa')
const PeerServer = require('peer').PeerServer
const serve = require('koa-static')
const Topics = require('./public/src/Topics.js')
const log4js = require('log4js')
const app = new Koa()
const port = process.env.PORT || 3001
const path = require('path')
const logger = log4js.getLogger('app')
const welcome = `
|           _     _                 _            _       _ _            _   
| ___ _ __ | |__ (_)_ __ __  __    | |_ ___  ___| |_ ___| (_) ___ _ __ | |_ 
|/ __| '_ \\| '_ \\| | '_ \\\\ \\/ /____| __/ _ \\/ __| __/ __| | |/ _ \\ '_ \\| __|
|\\__ \\ |_) | | | | | | | |>  <_____| ||  __/\\__ \\ || (__| | |  __/ | | | |_ 
||___/ .__/|_| |_|_|_| |_/_/\\_\\     \\__\\___||___/\\__\\___|_|_|\\___|_| |_|\\__|
|    |_|                                                                    
=============== Powered by Sphinx Logic ===============
-------- https://github.com/snaplingo-org/chatbot-sphinx --------
`
app.use(serve(path.join(__dirname, '/public')))

const httpServer = app.listen(port, function () {
  console.log(welcome)
  logger.info('Sphinx Test Client Listening on port', port)
})
const io = require('socket.io').listen(httpServer)

const peerServer = new PeerServer({ port: 9000, path: '/chat' })

peerServer.on('connection', function (id) {
  io.emit(Topics.USER_CONNECTED, id)
  logger.debug('User connected with #', id)
})

peerServer.on('disconnect', function (id) {
  io.emit(Topics.USER_DISCONNECTED, id)
  logger.debug('With #', id, 'user disconnected.')
})
