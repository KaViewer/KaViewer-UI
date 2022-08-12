<template>
  <div>
    <el-alert
      v-if="success === false"
      type="error"
      :title="showMsg"
      :description="showMsgStack"
      center
      show-icon
    >
    </el-alert>
    <el-alert
      v-if="success"
      type="success"
      title="Create Success"
      center
      show-icon
    >
    </el-alert>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="cluster-ruleForm"
    >
      <el-form-item label="ClusterName" prop="clusterName">
        <el-input
          v-model="ruleForm.clusterName"
          :disabled="editView"
        ></el-input>
      </el-form-item>
      <el-form-item label="bootstrapServerss" prop="bootstrapServers">
        <el-input
          v-model="ruleForm.bootstrapServers"
          :disabled="editView"
        ></el-input>
      </el-form-item>
      <el-form-item label="JAAS Config" prop="jaasConfig">
        <el-input v-model="ruleForm.jaasConfig" :disabled="editView"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          btn
        }}</el-button>
        <el-button v-if="!editView" @click="resetForm('ruleForm')"
          >Reset</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import getApi from "../../router/baseUrl";
const clusterNameValidator = (rule,value = "", cb)=> {
  if(value.indexOf('/') === -1){
    return  cb()
  }
  return cb(new Error("Can not contain '/' in ClusterName"))
}

export default {
  name: "ClusterPopup",
  props: {
    closeDialog: {
      type: Function,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      // new or edit
      editView: false,
      success: null,
      showMsg: null,
      showMsgStack: null,
      btn: "Submit",
      ruleForm: {
        clusterName: "",
        bootstrapServers: "",
        jaasConfig: "",
      },
      rules: {
        clusterName: [
          { required: true, message: "Input Cluster Name", trigger: "blur" },
          { validator: clusterNameValidator, trigger: "blur" },
        ],
        bootstrapServers: [
          {
            required: true,
            message: "Input Cluster bootstrapServers",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeParentDialog() {
      this.success = null;
      this.editView = false;
      this.closeDialog("ruleForm");
    },
    setFormForEdit(properties = {}) {
      this.editView = true;
      this.ruleForm = { ...properties };
    },
    submitForm(formName) {
      if (this.editView) {
        // TODO: edit
        return;
      }

      const url = getApi("/cluster");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...this.ruleForm }),
          };
          fetch(url, requestOptions)
            .then((response) => {
              if (!response.ok) {
                const error = response.json();
                return Promise.reject(error);
              }
              return response.ok;
            })

            .then((data) => {
              if (data) {
                this.success = true;
                setTimeout(() => {
                  this.closeParentDialog();
                }, 500);
              }
            })
            .catch((error) => {
              error.then((resp) => {
                const msg = resp.message;
                const stack = resp.stackTrace;
                this.showMsg = msg;
                this.showMsgStack = stack;
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.editView = false;
      this.$refs[formName].resetFields();
    },
  },
};
</script>