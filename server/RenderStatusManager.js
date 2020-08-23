class RenderJobManager {
    constructor(id) {
        this.jobId = id
        this.ws = null
    }
    setWs(ws) {
        this.ws = ws
    }
    onProgress(output) {
        if (this.ws !== null) {
            this.ws.send(output)
        }
    }
    onDone(statuscode) {
        if (this.ws !== null) {
            this.ws.send(`${jobId} DONE`)
        }
    }
}

class RenderStatusManager {
    constructor() {
        this.counter = 0
        // map of request id to websocket connection
        this.activeRenderRequests = new Map()
    }

    next() {
        const oldCounter = this.counter
        this.activeRenderRequests.set(oldCounter, new RenderJobManager(oldCounter)) 
        this.counter++
        return this.activeRenderRequests.get(oldCounter)
    }
    
    get(jobId) {
        return this.activeRenderRequests.get(jobId)
    }

}


module.exports = RenderStatusManager
