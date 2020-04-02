<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addDialogVisible=true">添加分类</el-button>
      <!-- 树状表格 -->
      <table-tree
        :data="tableData"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
      >
        <!-- 是否有效 -->
        <template slot="isOK" slot-scope="scoped">
          <i v-if="scoped.row.cat_deleted == false" class="el-icon-success" style="color:green"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scoped">
          <el-tag v-if="scoped.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scoped.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-else type="info">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="doSomething" slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scoped.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scoped.row.cat_id)"
          >删除</el-button>
        </template>
      </table-tree>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 编辑分类弹出框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_name">
          <div class="block">
            <el-cascader
              v-model="selectValue"
              :options="cascaderOptions"
              :props="cascProp"
              @change="cascaderChange"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/categoriesList.js"></script>

<style lang="less" scoped>
.el-card,
.block {
  margin-top: 15px;
}
.el-button {
  margin-bottom: 15px;
}
</style>
