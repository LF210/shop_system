<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="toAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="tableData" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="1100"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scoped">{{scoped.row.add_time | dataForm}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scoped.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scoped.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          @size-change="sizeChange"
          @current-change="currentChange"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 修改用户弹出框 -->
    <el-dialog title="修改商品" :visible.sync="editDialog" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/goodsList.js"></script>

<style lang="less" scoped>
.el-card,
.el-table,
.block {
  margin-top: 15px;
}
</style>
