<template>
  <div>
    <div>
      <el-input
        placeholder="Input Search Content"
        v-model="searchContent"
        class="input-with-select"
      >
        <el-select
          style="width: 150px"
          v-model="searchType"
          slot="prepend"
          placeholder="Search Type"
        >
          <el-option label="Header" value="headers"></el-option>
          <el-option label="Key" value="key"></el-option>
          <el-option label="Content" value="content"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFilter"
        ></el-button>
      </el-input>
    </div>
    <el-dialog
      :title="detailsDialogVisibleTitle"
      :visible.sync="detailsDialogVisible"
      :before-close="handleCloseDetailsDialog"
      append-to-body
    >
      <el-container>
        <el-header>
          <el-button-group style="position: absolute; left: 10px">
            <el-tooltip
              class="item"
              effect="dark"
              content="View Content in Pretty Format"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-s-grid"
                size="mini"
                @click="jsonFormat(detailsDialogShowData)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="View Content in JsonHero(Beta)"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-news"
                size="mini"
                @click="jsonViewer(detailsDialogShowData)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="primary"
              icon="el-icon-document-copy"
              size="mini"
              @click="copyDetails(detailsDialogShowData)"
            ></el-button>
          </el-button-group>
        </el-header>
        <el-main>
          <!-- :before-close="handleClose" -->
          <pre>{{ detailsDialogShowData }}</pre>
        </el-main>
      </el-container>
    </el-dialog>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      :default-sort="{ prop: 'offset', order: 'descending' }"
      max-height="500"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="top" inline class="kaviewer-table-expand">
            <el-form-item label="Headers">
              <span>{{ tripHeader(props.row.headers) }}</span>
              <el-button
                type="text"
                icon="el-icon-s-unfold"
                size="mini"
                @click="popUpDetails('Headers', props.row.headers)"
              ></el-button>
            </el-form-item>
            <el-form-item label="Key">
              <span>{{ tripHeader(props.row.key) }}</span>
              <el-button
                type="text"
                icon="el-icon-s-unfold"
                size="mini"
                @click="popUpDetails('Key', props.row.key)"
              ></el-button>
            </el-form-item>
            <el-form-item label="Content">
              <span>{{ tripHeader(props.row.content) }}</span>
              <el-button
                type="text"
                icon="el-icon-s-unfold"
                size="mini"
                @click="popUpDetails('Content', props.row.content)"
              ></el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="Offset" sortable prop="offset"> </el-table-column>
      <el-table-column label="Partition" sortable prop="partition">
      </el-table-column>

      <el-table-column label="Key" prop="key">
        <template slot-scope="scope">
          {{ tripHeader(scope.row.key) }}
        </template>
      </el-table-column>
      <el-table-column label="Content" prop="content">
        <template slot-scope="scope">
          {{ tripHeader(scope.row.content) }}
        </template>
      </el-table-column>
      <el-table-column label="TimeStamp" sortable prop="timestamp" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              TimestampType: {{ scope.row.timestampType }}
              <br />
              TimeStamp: {{ scope.row.timestamp }}
            </div>
            <span>
              {{ dateFormatter(scope.row.timestamp) }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.kaviewer-table-expand {
  font-size: 0;
}
.kaviewer-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.kaviewer-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import { JsonViewer } from "../../service/JsonViewerService";
export default {
  name: "MessageList",
  data() {
    return {
      detailsDialogVisible: false,
      detailsDialogShowData: "",
      detailsDialogVisibleTitle: "",

      searchType: "",
      searchContent: "",
      loading: false,
      tableData: [],
      originTableData: [],
    };
  },
  computed: {
    tripHeader() {
      return (msg) => {
        if (!msg || msg === "{}") return "";
        return msg.substr(0, 10) + "...";
      };
    },
    dateFormatter() {
      return (datetime) => {
        if (datetime) {
          datetime = new Date(datetime);
          let y = datetime.getFullYear();
          let m = datetime.getMonth() + 1;
          let d = datetime.getDate();
          let h = datetime.getHours();
          let min = datetime.getMonth();
          let s = datetime.getSeconds();
          let ms = datetime.getMilliseconds();
          const format = `${y}-${m}-${d} ${h}:${min}:${s}.${ms}`;
          return format;
        }
        return "";
      };
    },
  },
  methods: {
    popUpDetails(title, data) {
      this.detailsDialogVisibleTitle = title;
      this.detailsDialogVisible = true;
      this.detailsDialogShowData = data;
    },
    jsonFormat(data) {
      this.detailsDialogShowData = JSON.stringify(JSON.parse(data), null, 4);
    },
    copyDetails(data) {
      navigator.clipboard.writeText(data).then(
        () => {
          this.$message({
            message: "Copied !",
            type: "success",
          });
        },
        (error) => {
          console.log(error);
          this.$message.error("Copied error !");
        }
      );
    },
    handleCloseDetailsDialog() {
      this.detailsDialogShowData = "";
      this.detailsDialogVisibleTitle = "";
      this.detailsDialogVisible = false;
    },
    searchFilter() {
      if (this.searchContent && this.searchType) {
        this.tableData = this.originTableData.filter((data) =>
          data[this.searchType]
            .toLowerCase()
            .includes(this.searchContent.toLowerCase())
        );
        return;
      }
      this.tableData = this.originTableData;
    },
    jsonViewer(content) {
      const jv = new JsonViewer(content);
      if (jv.isValid()) {
        window.open(jv.buildRequest(), "_blank");
      } else {
        this.$message.error("Invalid Content to parser as Json");
      }
    },
    timestampHover(row) {
      console.log(row);
    },
    fillMessage(payload) {
      this.tableData = [];
      payload.forEach((element) => {
        this.tableData.push({
          headers: JSON.stringify(element.headers),
          offset: element.offset,
          partition: element.partition,
          key: element.key,
          content: element.value,
          timestamp: element.timestamp,
          timestampType: element.timestampType,
        });
      });
      this.originTableData = this.tableData;
      this.loading = false;
    },
    resetMessageList() {
      (this.tableData = []), (this.loading = true);
    },
  },
};
</script>