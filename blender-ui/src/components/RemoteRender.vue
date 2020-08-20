<template>
  <div>
    <div class="window" style="width: 300px">
      <div class="title-bar">
        <div class="title-bar-text">Render Blender Projects</div>
        <div class="title-bar-controls">
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
      default: 'localhost:3000'
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
      const ws = new WebSocket(`ws://${this.serverUrl}`)
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
      this.file = e.target.files[0]
    },

    sendFile() {
      const formData = new FormData()
      console.log(this.file)
      formData.append('blendFile', this.file)
      axios({
        method: 'post',
        url: `http://${this.serverUrl}/upload`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
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
