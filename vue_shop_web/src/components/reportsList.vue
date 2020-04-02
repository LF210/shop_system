<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div ref="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script src="../assets/js/reportsList.js"></script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
