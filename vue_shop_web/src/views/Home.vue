<template>
  <div class="home">
    <el-container>
      <el-header>
        <img class="logo" src="../assets/images/heima.png" />
        <div class="logoText">电商后台管理系统</div>
        <el-button type="info" class="logoutBtn" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse? '64px':'200px'">
          <div class="flexible" @click="isCollapse = !isCollapse">|||</div>
          <el-menu
            background-color="#333744"
            active-text-color="#409eff"
            text-color="#ffffff"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu v-for="(item,index) in menuList" :index="item.path" :key="index">
              <template slot="title">
                <i :class="iconArr[index]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                v-for="(item2,index2) in item.children"
                :index="item2.path"
                :key="index2"
              >
                <i class="el-icon-menu"></i>
                {{item2.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 是否折叠
      isCollapse: false,
      // 菜单面板
      menuList: [],
      // 图标集合
      iconArr: [
        "el-icon-user-solid",
        "el-icon-s-promotion",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-marketing"
      ]
    };
  },
  methods: {
    // 登出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.success("退出成功");
    },
    // 获取左侧菜单
    async getMenus() {
      const { data: res } = await this.$http.get("menus");
      this.menuList = res.data;
    }
  },
  created() {
    this.getMenus();
  }
};
</script>

<style lang="less" scoped>
.home,
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  .logo {
    margin-top: 2px;
    float: left;
  }
  .logoText {
    float: left;
    margin-left: 10px;
    font-size: 22px;
    color: #fff;
    line-height: 60px;
  }
  .logoutBtn {
    float: right;
    margin-top: 10px;
  }
}
.el-aside {
  background-color: #313541;
  height: 100%;
  .flexible {
    width: 200px;
    height: 20px;
    background-color: #4a5064;
    text-align: center;
    line-height: 20px;
    color: white;
    font-size: 12px;
    letter-spacing: 1px;
    cursor: default;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
