/* eslint-disable semi */
<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 表单区域 -->
      <el-form class="login-form" ref="form">
        <el-form-item>
          <el-input v-model="name" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            label="我已阅读并同意用户协议和隐私条款"
            name="type"
            v-model="isNum"
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            :loading="isLoading"
            :disabled="!isNum"
            type="primary"
            @click.prevent="deng"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  props: [""],
  data() {
    return {
      // 用户账号
      name: "",
      // 用户密码
      password: "",
      // 是否勾选协议
      isNum: false,
      // 判断按钮是否处于加载中
      isLoading: false
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    deng() {
      // es6解构获取的账号和密码
      const { name, password } = this;
      //  判断用户是否未输入就登陆
      if (name === "" || password === "") return;
      // 点击之后切换按钮状态 改变为加载中
      this.isLoading = true;

      axios({
        method: "POST",
        url: "http://ttapi.research.itcast.cn/mp/v1_0/authorizations",
        data: {
          mobile: name,
          code: password
        }
      })
        .then(res => {
          // 发起弹出框提示
          this.$message({
            message: "登陆成功",
            type: "success"
          });
          // 请求完成结束按钮加载中状态
          this.isLoading = false;
        })
        .catch(err => {
          this.$message({
            message: "登陆失败",
            type: "error"
          });
          this.isLoading = false;
        });
    }
  },

  watch: {}
};
</script>
<style lang="less" scoped>
// 铺满整屏
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("../../assets/1331.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: rgba(0, 0, 0, 0.1);
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("../../assets/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
