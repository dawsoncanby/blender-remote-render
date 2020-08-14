const http = require('http')
const WebSocketServer = require('websocket').server

const httpServer = http.createServer()
httpServer.listen(9898)

const wsServer = new WebSocketServer({
    httpServer
})

wsServer.on('request', req => {
    const conn = req.accept(null, req.origin)
    conn.on('message', msg => {
        console.log('Recieved: ' + msg)
        conn.sendUTF('This is server')
    })
    conn.on('close', (reasonCode, description) => {
        console.log('client disconnected')
    })
})