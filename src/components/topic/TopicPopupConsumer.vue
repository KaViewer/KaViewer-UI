<template>
  <el-container>
    <el-aside width="200px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
        class="kaviewer-ruleForm"
      >
        <el-card shadow="always">
          <el-form-item label="Topic">
            <b>{{ topic }}</b>
          </el-form-item>
        </el-card>
        <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
        <el-form-item label="Partition" prop="partition">
          <el-tooltip
            class="item"
            effect="dark"
            content="If set partition may get records less than size"
            placement="right-end"
          >
            <el-select
              v-model="ruleForm.partition"
              placeholder="Partition, default 0"
            >
              <el-option label="ALL" :value="-1" :key="-1"></el-option>
              <el-option label="0" :value="0" :key="0"></el-option>
              <el-option
                v-for="partition in partitions"
                :label="partition"
                :value="partition"
                :key="partition"
              ></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Offset" prop="offset">
          <el-tooltip
            class="item"
            effect="dark"
            content="Start fetch message from specift offset"
            placement="right-end"
          >
            <el-input v-model="ruleForm.offset"> </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Size" prop="size">
          <el-select v-model="ruleForm.size" placeholder="Size, default 100">
            <el-option label="10" value="10"></el-option>
            <el-option label="50" value="50"></el-option>
            <el-option label="100" value="100"></el-option>
            <el-option label="200" value="200"></el-option>
            <el-option label="500" value="500"></el-option>
            <!-- <el-option label="200" value="200"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="KeyDeserializer" prop="keyDeserializer">
          <el-radio-group v-model="ruleForm.keyDeserializer">
            <el-radio label="StringDeserializer"></el-radio>
            <el-radio label="ByteArrayDeserializer"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ValueDeserializer" prop="valueDeserializer">
          <el-radio-group v-model="ruleForm.valueDeserializer">
            <el-radio label="StringDeserializer"></el-radio>
            <el-radio label="ByteArrayDeserializer"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            icon="el-icon-search"
            >Query</el-button
          >
        </el-form-item>
      </el-form>
    </el-aside>

    <el-container>
      <el-main>
        <MessageList ref="messageList" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MessageList from "./MessageList.vue";
import getApi from "../../router/baseUrl";
export default {
  components: {
    MessageList,
  },
  props: {
    cluster: {
      type: String,
      require: true,
    },
    topic: {
      type: String,
      require: true,
    },
    partitions: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  data() {
    return {
      messages: [],
      ruleForm: {
        partition: -1,
        offset: "",
        size: "50",
        keyDeserializer: "StringDeserializer",
        valueDeserializer: "StringDeserializer",
      },
      rules: {
        size: [{ required: true, message: "Set the Size", trigger: "change" }],
        partition: [
          { required: true, message: "Set the Partition", trigger: "change" },
        ],
        valueDeserializer: [
          {
            required: true,
            message: "Chose the ValueDeserializer",
            trigger: "change",
          },
        ],
        keyDeserializer: [
          {
            required: true,
            message: "Chose the KeyDeserializer ",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetPopup() {
      this.resetForm("ruleForm");
      this.$refs.messageList.fillMessage([]);
    },
    load(cluster, topic, kd, vd, limit, partition, offset) {
      this.$refs.messageList.resetMessageList();
      const offsetParam = (offset || "") && `&offset=${offset}`;
      const url = `${getApi()}/topic/${topic}/p/${partition}?keyDeserializer=${kd}&valDeserializer=${vd}&limit=${limit}${offsetParam}`;
      const headers = {
        "Content-Type": "application/json",
        "k-cluster": cluster,
      };
      fetch(url, { headers })
        .then((resp) => {
          return resp.json();
        })
        .then((payload) => {
          if (payload && payload.stackTrace) {
            this.$message.error(payload.stackTrace);
            this.$refs.messageList.fillMessage([]);
            return;
          }
          this.messages = payload;
          this.$refs.messageList.fillMessage(payload);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const topic = this.topic;
          const kd =
            this.ruleForm.keyDeserializer === "StringDeserializer"
              ? "string"
              : "byte";
          const vd =
            this.ruleForm.valueDeserializer === "StringDeserializer"
              ? "string"
              : "byte";
          const limit = Number(this.ruleForm.size || 500);
          const partition = (this.partition = this.ruleForm.partition);
          const offset = Number(this.ruleForm.offset) || undefined;
          this.load(this.cluster, topic, kd, vd, limit, partition, offset);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>