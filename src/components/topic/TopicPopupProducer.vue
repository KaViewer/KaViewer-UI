<template>
  <el-container>
    <el-aside width="200px">
      <el-form
        :model="metaRuleForm"
        :rules="rules"
        ref="metaRuleForm"
        label-width="100px"
        label-position="top"
        class="kaviewer-metaRuleForm"
      >
        <el-card shadow="always">
          <el-form-item label="Topic">
            <b>{{ topic }}</b>
          </el-form-item>
        </el-card>
        <el-form-item label="TargetPartition" prop="partition">
          <el-select
            v-model="metaRuleForm.partition"
            placeholder="Partition, default 0"
          >
            <el-option
              v-for="partition in partitions"
              :label="partition"
              :value="partition"
              :key="partition"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="KeyDeserializer" prop="keyDeserializer">
          <el-radio-group v-model="metaRuleForm.keyDeserializer">
            <el-radio label="StringDeserializer"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ValueDeserializer" prop="valueDeserializer">
          <el-radio-group v-model="metaRuleForm.valueDeserializer">
            <el-radio label="StringDeserializer"></el-radio>
            <!-- <el-radio label="ByteArrayDeserializer"></el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-aside>

    <el-container>
      <el-main>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="Message Headers">
            <div
              v-for="(domain, index) in form.messageHeaders"
              :label="'header' + index"
              :key="domain.uniqueTimestamp"
              :prop="'messageHeaders.' + index + '.pair'"
            >
              <el-col :span="9">
                Key
                <el-input v-model="domain.key" size="mini"></el-input>
              </el-col>
              <el-col :span="9">
                Value
                <el-input v-model="domain.value" size="mini"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  @click.prevent="removeDomain(domain)"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-col>
            </div>
          </el-form-item>
          <el-button @click="addDomain" type="primary" size="mini"
            >Add Message Header</el-button
          >
          <el-form-item label="Key">
            <el-input v-model="form.messageKey"></el-input>
          </el-form-item>
          <el-form-item label="Message">
            <el-input type="textarea" v-model="form.messageContent"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSend" icon="el-icon-s-promotion"
              >Send</el-button
            >
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import getApi from "../../router/baseUrl";
export default {
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
    },
  },
  data() {
    return {
      messages: [],
      form: {
        messageHeaders: [
          {
            uniqueTimestamp: "",
            key: "",
            value: "",
          },
        ],
        messageKey: "",
        messageContent: "",
      },
      metaRuleForm: {
        partition: 0,
        keyDeserializer: "StringDeserializer",
        valueDeserializer: "StringDeserializer",
      },
      rules: {
        partition: [
          { required: true, message: "Set the Partition", trigger: "change" },
        ],
        valueDeserializer: [
          {
            required: true,
            message: "Chose the ValueDeserializer",
            trigger: "blur",
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
    messageHeadersValidated() {
      return this.form.messageHeaders.filter((data) => data.key && data.value);
    },
    send() {
      const url = `${getApi()}/producer`;
      const headers = {
        "Content-Type": "application/json",
        "k-cluster": this.cluster,
      };

      // build body
      const payload = {
        topic: this.topic,
        partition: this.metaRuleForm.partition,
        key: this.form.messageKey,
        value: this.form.messageContent,
        headers: this.messageHeadersValidated(),
      };
      const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      };
      fetch(url, requestOptions)
        .then((resp) => {
          if (resp.ok) {
            this.resetForm("form");

            this.$message({
              message: "Send Success !",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSend() {
      this.$refs["metaRuleForm"].validate((valid) => {
        if (valid) {
          this.send();
        } else {
          console.log("meta Rule failed");
        }
      });
    },
    resetForm() {
      this.form.messageHeaders = [];
      this.form.messageKey = "";
      this.form.messageContent = "";
      this.form.messageHeaders = "";
      this.metaRuleForm.partition = 0;
    },
    removeDomain(item) {
      var index = this.form.messageHeaders.indexOf(item);
      if (index !== -1) {
        this.form.messageHeaders.splice(index, 1);
      }
    },
    addDomain() {
      console.log(this.form.messageHeaders);
      this.form.messageHeaders.push({
        value: "",
        key: "",
        uniqueTimestamp: Date.now(),
      });
    },
  },
};
</script>