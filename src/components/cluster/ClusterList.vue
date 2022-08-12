<template>
  <el-container>
    <el-container>
      <NavMenu />
      <el-header style="text-align: right; font-size: 12px">
        <el-button type="primary" @click="addCluster" icon="el-icon-plus">
          NEW
        </el-button>
        <el-dialog
          :visible.sync="dialogFormVisible"
          @close="closeDialog('ruleForm')"
        >
          <ClusterPopup ref="popup" :closeDialog="closeDialog" />
        </el-dialog>
      </el-header>

      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="cluster" label="ClusterName">
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'ClusterInspect',
                  params: { clusterName: scope.row.cluster },
                }"
                >{{ scope.row.cluster }}</router-link
              >
            </template>
          </el-table-column>
          <el-table-column
            type="expand"
            prop="hosts"
            label="Brokers"
            width="180"
          >
            <template slot-scope="props">
              <span v-for="broker in props.row.hosts" :key="broker">
                <el-divider
                  ><i
                    class="el-icon-location-outline"
                    content-position="right"
                  ></i
                ></el-divider>
                {{ broker }}</span
              >
            </template>
          </el-table-column>
          <!-- <el-table-column prop="Date" label="Date" width="140">
          </el-table-column> -->
          <el-table-column prop="operation" label="Operation">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="setEditForm(scope.row)"
                ></el-button>
                <template>
                  <el-popconfirm
                    title="Are you sure to delete it ?"
                    @confirm="deleteCluster(scope.row.cluster)"
                  >
                    <el-button
                      slot="reference"
                      type="primary"
                      icon="el-icon-delete"
                    ></el-button>
                  </el-popconfirm>
                </template>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import ClusterPopup from "./ClusterPopup.vue";
import NavMenu from "../common/NavMenu.vue";
import { getClusterList, deleteCluster } from "../../service/ClusterService";
import getApi from "../../router/baseUrl";

export default {
  name: "ClusterList",
  components: {
    ClusterPopup,
    NavMenu,
  },
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
    };
  },
  methods: {
    load() {
      getClusterList().then((payload) => {
        let items = [];
        payload.forEach((element) => {
          const hosts = element.brokers.map((broker) => {
            return broker.host + ":" + broker.port;
          });
          items.push({
            cluster: element.cluster,
            hosts: hosts,
          });
        });
        this.tableData = items;
      });
    },
    addCluster() {
      this.dialogFormVisible = true;
    },
    deleteCluster(clusterName) {
      deleteCluster(clusterName).then((resp) => {
        if (resp.ok) {
          this.load();
        }
      });
    },
    closeDialog(formName) {
      this.load();
      this.dialogFormVisible = false;
      this.$refs.popup.resetForm(formName);
    },
    setEditForm(row) {
      const url = getApi("/meta");
      const headers = {
        "Content-Type": "application/json",
        "k-cluster": row.cluster,
      };
      fetch(url, { headers })
        .then((resp) => {
          return resp.json();
        })
        .then((payload) => {
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs.popup.setFormForEdit(payload);
          });
        });
    },
  },
  created() {
    this.load();
  },
};
</script>

<style scoped>
/* .el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
} */
</style>
