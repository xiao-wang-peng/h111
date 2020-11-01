/* eslint-disable semi */
<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 表单区域 -->
      <el-form class="login-form" ref="form" :rules="rules" :model="form">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            label="我已阅读并同意用户协议和隐私条款"
            name="type"
            v-model="form.isNum"
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            :loading="isLoading"
            :disabled="!form.isNum"
            type="primary"
            @click.prevent="ydeng"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: [''],
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }
        ]
      },
      form: {
        // 用户账号
        name: '13911111111',
        // 用户密码
        password: '246810'
      },
      // 是否勾选协议
      isNum: false,
      // 判断按钮是否处于加载中
      isLoading: false
    }
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {
    async deng () {
      // es6解构获取的账号和密码
      const { name, password } = this.form
      // 点击之后切换按钮状态 改变为加载中
      this.isLoading = true
      try {
        const res = await this.$axios({
          method: 'POST',
          url: '/mp/v1_0/authorizations',
          data: {
            mobile: name,
            code: password
          }
        })
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        localStorage.setItem('token', res.data.data.token)
        // 请求完成结束按钮加载中状态
        this.$router.push('/')
        this.isLoading = false
        // console.log(res);
      } catch (error) {
        this.$message({
          message: '登陆失败',
          type: 'error'
        })
        this.isLoading = false
      }
    },
    ydeng () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.deng()
        } else {
          this.$message({
            message: '账号或者密码错误',
            type: 'error'
          })
        }
      })
    }
  },

  watch: {}
}
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
