<template>
  <el-container>
    <el-container>
      <NavMenu />
      <el-header style="text-align: right; font-size: 12px">
        <el-row :gutter="20">
          <el-col :span="6" :offset="15">
            <div>
              <el-input
                v-model="searchCluster"
                placeholder="Search Cluster"
                @change="doSearchCluster"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="1" v-if="this.permission&&this.permission.cluster&& this.permission.cluster.create "
            ><div>
              <el-button type="primary" @click="addCluster" icon="el-icon-plus">
                NEW
              </el-button>
            </div></el-col
          >
        </el-row>
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
              >
                <el-tag
                  id="cluster-name"
                  effect="light"
                  :type="
                    ['success', 'info', 'warning', 'danger'][
                      scope.row.index % 4
                    ]
                  "
                  >{{ scope.row.cluster }}</el-tag
                ></router-link
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="this.permission&&this.permission.cluster&&this.permission.cluster.read"
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
            <template slot-scope="scope" :permission = "permission">
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
                      v-if="permission&&permission.cluster&&permission.cluster.delete"
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
import { getPermissionList } from "../../service/PermissionService";
import getApi from "../../router/baseUrl";

export default {
  name: "ClusterList",
  components: {
    ClusterPopup,
    NavMenu,
  },
  data() {
    return {
      permission: true,
      searchCluster: "",
      dialogFormVisible: false,
      tableData: [],
      tableDataOrigin: [],
    };
  },
  methods: {
    load() {
      getClusterList().then((payload) => {
        let items = [];
        let index = 0;
        payload.forEach((element) => {
          const hosts = element.brokers.map((broker) => {
            return broker.host + ":" + broker.port;
          });
          items.push({
            cluster: element.cluster,
            hosts: hosts,
            index: index++,
          });
        });
        this.tableData = items;
        this.tableDataOrigin = items;
      });
    },
    addCluster() {
      this.dialogFormVisible = true;
    },
    deleteCluster(clusterName) {
      deleteCluster(clusterName).then((resp) => {
        if (resp.ok) {
          this.load();
          this.$message({
            message: `Delete Cluster [${clusterName}] Success !`,
            type: "success",
          });
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
    doSearchCluster() {
      if (!this.searchCluster) {
        this.tableData = this.tableDataOrigin;
        return;
      }

      this.tableData = this.tableDataOrigin.filter((data) =>
        data.cluster.toLowerCase().includes(this.searchCluster.toLowerCase())
      );
    },
  },
  created() {
    getPermissionList().then(resp=>{
      this.permission = resp
    })
    this.load();
  },
};
</script>

<style scoped>
#cluster-name {
  font-size: 1pc;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>
