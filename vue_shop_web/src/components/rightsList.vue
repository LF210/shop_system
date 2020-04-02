<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="tableData" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scoped.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script src="../assets/js/rightsList.js"></script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
