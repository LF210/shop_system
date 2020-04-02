<template>
  <div class="loginBox">
    <!-- 卡片 -->
    <el-card class="card">
      <!-- 图片 -->
      <div class="avatar">
        <img src="../assets/images/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form :model="loginForm" ref="loginRef" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-icon-user" style="padding-left:5px"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="el-icon-lock" style="padding-left:5px"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button type="info" @click="reset" style="float:right">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据
      loginForm: {
        // 用户名
        username: "admin",
        // 密码
        password: "123456"
      },
      // 登录表单校验
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 重置表单数据
    reset() {
      this.loginForm.username = "";
      this.loginForm.password = "";
    },
    // 登录
    submit() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
        this.$message.success("登录成功");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.loginBox {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.card {
  width: 450px;
  height: 304px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: initial;
}
.el-form {
  margin-top: -40px;
}
.avatar {
  position: relative;
  width: 130px;
  height: 130px;
  padding: 7px;
  border-radius: 50%;
  border: 1px solid #fff;
  background-color: #fff;
  box-shadow: 0 0 10px #eeeeee;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #fff;
    background-color: #eee;
  }
}
img {
  width: 100%;
  height: 100%;
}
</style>
