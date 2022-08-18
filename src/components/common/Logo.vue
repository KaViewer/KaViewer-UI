<template>
  <el-row id="logo-kaviewer">
    <el-col :span="2"
      ><div class="grid-content bg-purple">
<a href="https://github.com/Koooooo-7/KaViewer" target="_blank"
      >
        <el-image
      style="width: 50px; height: 50px"
      :src="src"
      fit="cover"></el-image>
</a>

      </div>
      </el-col
    >
    <el-col :span="2" :offset="1"
      ><div >
        <div>KaViewer</div>
      </div></el-col
    >
  </el-row>
</template>
<script>
import icon from '../../asset/icon.png'
export default {
  name: "Logo",
  data() {
      return {
        src: icon 
      }
    }
};
</script>
<style scoped>
#logo-kaviewer {
  font-size: 52px;
  color: #409EFF;
}
</style>
