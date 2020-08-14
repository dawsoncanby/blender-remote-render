const http = require('http')
const WebSocketServer = require('websocket').server

const httpServer = http.createServer((req, res) => {
    if (req.method === 'POST') {
        const buff = []
        req
        .on('data', data => buff.push(data))
        .on('end', () => {
            console.log('done')
            res.statusCode = 200
            res.end()
        })
        .on('error', err => {
            console.error(err)
            res.statusCode = 500
        })
    }
})

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