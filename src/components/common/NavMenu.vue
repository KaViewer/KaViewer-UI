<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="clusters"
      class="el-menu-kaviewer"
      mode="horizontal"
      background-color="#409EFF"
      text-color="#3C50BE"
      active-text-color="#fff"
    >
      <el-menu-item index="1">
        <router-link to="/">Clusters</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/">Others</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style scoped>
 .router-link-active{
    text-decoration: none;
    font-size: 20px;
 }
</style>
<script>
export default {
  name: "SideBar",
  data() {
    return {
      clusters: "1",
    };
  },
};
</script>