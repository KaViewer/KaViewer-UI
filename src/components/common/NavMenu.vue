<template>
  <div>
    <div class="line">
      <el-row >
        <el-col :span="7"><div><Logo /></div></el-col>
        <el-col :span="1" :offset="15"
          ><div>
            <GithubIcon />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-menu
      :default-active="clusters"
      class="el-menu-kaviewer"
      mode="horizontal"
      background-color="#409EFF"
      text-color="#000"
      active-text-color="#fff"
    >
      <el-menu-item index="1" style="border-bottom-color:#409EFF;">
        <router-link to="/">Clusters</router-link>
      </el-menu-item>
      <!-- <el-menu-item index="2" disabled>
        <router-link to="/">TODO</router-link>
      </el-menu-item> -->
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
import GithubIcon from "./GithubIcon.vue";
import Logo from './Logo.vue';
export default {
  components: {
    GithubIcon,
    Logo,
  },
  data() {
    return {
      clusters: "1",
    };
  },
};
</script>