<template>
  <div>
    <div class="window" style="width: 300px">
      <div class="title-bar">
        <div class="title-bar-text">Render Blender Projects</div>
        <div class="title-bar-controls">
          <!-- <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button> -->
        </div>
      </div>
      <div class="window-body">
        <fieldset>
          <legend>Upload a .blend file</legend>
          <input type="file" ref="fileUpload" @change="onFileChange">
        </fieldset>
        <fieldset class="mt-1">
          <legend>Render as:</legend>
          <div class="field-row">
            <input v-model="renderAs" id="render-as-img" type="radio" value="img">
            <label for="render-as-img">Image</label>
          </div>
          <div class="field-row">
            <input v-model="renderAs" id="render-as-anim" type="radio" value="anim">
            <label for="render-as-anim">Animation</label>
          </div>
        </fieldset>
        <button @click="sendFile" :disabled="file === null" class="mt-1">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    serverUrl: {
      type: String,
      default: 'ws://localhost:9898'
    },
  },

  data: () => ({
    websocket: null,
    renderAs: 'anim',
    file: null,
  }),

  created() {
    this.connect()
  },

  methods: {
    connect() {
      const ws = new WebSocket(this.serverUrl)
      ws.binaryType = 'arraybuffer'
      ws.onerror = e => console.log(e)

      ws.onopen = () => {
        console.log('connected')
      }

      ws.onclose = () => {
        console.log('closed')
      }

      ws.onmessage = evt => {
        console.log(evt)
      }

      this.websocket = ws
    },

    onFileChange(e) {
      if (e.target.files.length === 0) return
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.file = e.target.result
      }
      reader.readAsArrayBuffer(file)
    },

    sendFile() {
      axios({
        url: this.serverUrl,
        body: this.file,
      })
    }
  },
}
</script>

<style scoped>
.mt-1 {
  margin-top: 10px;
}
</style>
