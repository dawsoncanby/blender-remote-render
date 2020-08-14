<template>
  <div id="app">
    <RemoteRender/>
  </div>
</template>

<script>
import RemoteRender from './components/RemoteRender.vue'
import '98.css'

export default {
  name: 'App',
  components: {
    RemoteRender
  }
}
</script>

<style>
html {
  height: 100%;
  width: 100%;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: teal;
}

#app {
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
