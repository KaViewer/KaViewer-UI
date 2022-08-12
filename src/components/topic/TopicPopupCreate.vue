<template>
  <el-container>
    <el-main>
      <el-form
        :model="createTopicForm"
        :rules="rules"
        ref="createTopicForm"
        label-width="150px"
        labelPosition="left"
        class="demo-createTopicForm"
      >
        <el-form-item label="Cluster">
          <el-input v-model="cluster" :disabled="true"> </el-input>
        </el-form-item>
        <el-form-item label="TopicName" prop="topicName">
          <el-input v-model="createTopicForm.topicName" clearable></el-input>
        </el-form-item>
        <el-form-item label="PartitionSize" required>
          <el-col :span="12">
            <el-form-item prop="partitionSize">
              <el-input-number v-model="createTopicForm.partitionSize" :min="1">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="ReplicationFactor"
              prop="replicationFactor"
              required
            >
              <el-input-number
                v-model="createTopicForm.replicationFactor"
                :min="1"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('createTopicForm')"
            >Add Topic</el-button
          >
          <el-button @click="resetForm()">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import { addTopic } from "../../service/TopicService";
const numberValidator = (rule, value = 0, cb) => {
  if (value > 0) {
    return cb();
  }
  return cb(new Error("Invalid input: " + rule.fullField));
};
export default {
  props: {
    cluster: {
      type: String,
      require: true,
    },
    reload: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      createTopicForm: {
        topicName: "",
        partitionSize: 1,
        replicationFactor: 1,
      },
      rules: {
        topicName: [
          { required: true, message: "Input topic name", trigger: "blur" },
        ],
        partitionSize: [
          { required: true, message: "Input partition Size", trigger: "blur" },
          { type: "number", message: "Should be number" },
          { validator: numberValidator, trigger: "blur" },
        ],
        replicationFactor: [
          {
            required: true,
            message: "Input ReplicationFactor Size",
            trigger: "blur",
          },
          { type: "number", message: "Should be number" },
          { validator: numberValidator, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addTopic(this.cluster, this.createTopicForm)
            .then((resp) => {
              if (resp.ok) {
                this.resetForm();
                this.$message({
                  message: "Add Topic Success !",
                  type: "success",
                });
                this.reload(this.cluster);
              } else {
                return resp.json();
              }
            })
            .then((ex) => {
              this.$message.error(ex.stackTrace);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.createTopicForm.topicName = "";
      this.createTopicForm.partitionSize = 1;
      this.createTopicForm.replicationFactor = 1;
    },
  },
};
</script>