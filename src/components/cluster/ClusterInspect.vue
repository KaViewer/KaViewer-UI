<template>
  <el-container>
    <el-container>
      <NavMenu />
      <el-header style="text-align: left; font-size: 35px">
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            {{ $route.params.clusterName }}
            <el-dialog :visible.sync="dialogShowTopicPopup">
              <TopicPopupConsumer
                :topic="topicName"
                :cluster="clusterName"
                :partitions="partitions"
                ref="topicPopup"
              />
            </el-dialog>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input
              v-model="searchTopic"
              placeholder="Search Topic"
              @change="doSearchTopic"
            ></el-input>
          </el-col>
          <el-col :span="6" :offset="2"
            ><div class="grid-content bg-purple">
              <el-button type="primary" @click="addTopic" icon="el-icon-plus">
                NEW
              </el-button>
            </div></el-col
          >
        </el-row>

        <el-dialog :visible.sync="dialogShowTopicPopupProducer">
          <TopicPopupProducer
            :topic="topicName"
            :cluster="clusterName"
            :partitions="partitions"
            ref="topicPopupProducer"
          />
        </el-dialog>
        <el-dialog
          :visible.sync="dialogFormVisibleTopicCreate"
          @close="closeTopicCreateDialog()"
        >
          <TopicPopupCreate
            :cluster="clusterName"
            :reload="load"
            ref="topicPopupCreate"
          />
        </el-dialog>
      </el-header>

      <el-main>
        <el-table :data="tableData" v-loading="loading">
          <el-table-column prop="topicName" label="Topic"> </el-table-column>
          <el-table-column prop="partitionSize" label="PartitionSize">
          </el-table-column>
          <el-table-column prop="operation" label="Operation">
            <template slot-scope="scope">
              <el-button-group>
                <!-- <el-button type="primary" icon="el-icon-edit"></el-button> -->
                <el-button
                  type="primary"
                  icon="el-icon-chat-line-square"
                  @click="popUpTopic(scope.row)"
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-s-promotion "
                  @click="popUpTopicProducer(scope.row)"
                ></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import TopicPopupConsumer from "../topic/TopicPopupConsumer.vue";
import TopicPopupProducer from "../topic/TopicPopupProducer.vue";
import TopicPopupCreate from "../topic/TopicPopupCreate.vue";
import NavMenu from "../common/NavMenu.vue";
import getApi from "../../router/baseUrl";
const url = getApi("/topic/meta");

export default {
  name: "ClusterInspect",
  components: {
    TopicPopupConsumer,
    TopicPopupProducer,
    NavMenu,
    TopicPopupCreate,
  },
  data() {
    return {
      searchTopic: "",
      loading: true,
      clusterName: this.$route.params.clusterName,
      topicName: null,
      partitions: 0,
      tableData: [],
      tableDataOrigin: [],
      dialogShowTopicPopup: false,
      dialogShowTopicPopupProducer: false,
      dialogFormVisibleTopicCreate: false,
    };
  },
  methods: {
    load(cluster) {
      const headers = {
        "Content-Type": "application/json",
        "k-cluster": cluster,
      };
      fetch(url, { headers })
        .then((resp) => {
          return resp.json();
        })
        .then((payload) => {
          this.tableData = payload;
          this.tableDataOrigin = payload;
          this.loading = false;
        });
    },
    closeTopicCreateDialog() {
      // this.load(this.clusterName);
      this.dialogFormVisibleTopicCreate = false;
      this.$refs.topicPopupCreate.resetForm();
    },
    addTopic() {
      this.dialogFormVisibleTopicCreate = true;
    },
    popUpTopic(row) {
      const { topicName, partitionSize } = row;
      this.topicName = topicName;
      // partitions is partitionSize-1
      this.partitions = partitionSize - 1;
      this.dialogShowTopicPopup = true;
      this.$nextTick(() => {
        this.$refs.topicPopup.resetPopup();
      });
    },
    popUpTopicProducer(row) {
      const { topicName, partitionSize } = row;
      this.topicName = topicName;
      // partitions is partitionSize-1
      this.partitions = partitionSize - 1;
      this.dialogShowTopicPopupProducer = true;
    },
    doSearchTopic() {
      if (!this.searchTopic) {
        this.tableData = this.tableDataOrigin;
        return;
      }

      this.tableData = this.tableDataOrigin.filter((data) =>
        data.topicName.toLowerCase().includes(this.searchTopic.toLowerCase())
      );
    },
  },
  created() {
    this.load(this.clusterName);
  },
};
</script>

<style>
.el-header,
.el-footer {
  color: rgb(121, 187, 255);
  text-align: center;
  line-height: 60px;
}
</style>
