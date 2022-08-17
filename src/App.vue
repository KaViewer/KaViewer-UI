
<template>
  <div id="app">
    <BaseLayout />
  </div>
</template>

<script>
import BaseLayout from './components/BaseLayout.vue'

export default {
  name: 'App',
  components: {
    BaseLayout
  }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: px; */
}
a {text-decoration: none;}
</style>
