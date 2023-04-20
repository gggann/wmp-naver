<template>
  <div id="app">
 
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';
import cheerio from 'cheerio';
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}

</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
#top{
  position: fixed;
  bottom: 30px;
  right:30px
} */
</style>
