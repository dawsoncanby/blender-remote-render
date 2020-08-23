const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')

const http = require('http')
const WebSocket = require('ws')

const { render } = require('./render.js')
const RenderStatusManager = require('./RenderStatusManager.js')

const app = express()

// create manager to send data to correct connections
const statusManager = new RenderStatusManager()

console.log(statusManager)

// enable files upload
app.use(fileUpload({
    createParentPath: true
}))

//add other middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//start app
const port = process.env.PORT || 8432

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
)

app.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            //Use the name of the input field to retrieve the uploaded file
            let blendfile = req.files.blendFile

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            const savedFilePath = `./uploads/${blendfile.name}`
            blendfile.mv(savedFilePath)

            // create a dedicated manager to handle output and send status back to user
            const jobManager = statusManager.next()

            // render blender file
            console.log(`file uploaded, rendering ${blendfile.name}`)
            render(savedFilePath, 
                jobManager.onProgress.bind(jobManager),
                stderr => { console.error(stderr) },
                jobManager.onDone.bind(jobManager)
            )

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: blendfile.name,
                    mimetype: blendfile.mimetype,
                    size: blendfile.size,
                    jobId: jobManager.jobId
                }
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

// websockets
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
    ws.on('message', message => {
        // message is assumed to be the job id
        statusManager.get(parseInt(message)).setWs(ws)
    })

    ws.send('Connected')
})

server.listen(9898, () => {
    console.log(`websocket server started on ${server.address().port}`);
})
