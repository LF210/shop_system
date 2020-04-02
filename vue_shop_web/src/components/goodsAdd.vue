<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 提示消息 -->
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 外层form表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef">
        <!-- tab切换 -->
        <el-tabs v-model="activeName" tab-position="left" @tab-click="tabClick">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <br />
              <div class="block">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="selectOptions"
                  :props="cascaderProps"
                  @change="cascChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <template>
              <el-form-item v-for="item1 in manyList" :key="item1.id" :label="item1.attr_name">
                <br />
                <el-checkbox
                  border
                  :checked="true"
                  v-for="item2 in item1.attr_vals"
                  :key="item2.id"
                >{{item2}}</el-checkbox>
              </el-form-item>
            </template>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item v-for="item in onlyList" :key="item.id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="uploadHeaders"
              :on-preview="imgPreview"
              :on-success="imgSuccess"
              :on-remove="imgRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor" class="quillEditor"></quill-editor>
            <el-button type="primary" @click="addGoods" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹出框 -->
    <el-dialog title="图片预览" :visible.sync="imgVisible" width="50%">
      <img :src="imgSrc" />
    </el-dialog>
  </div>
</template>

<script src="../assets/js/goodsAdd.js"></script>

<style lang="less" scoped>
.el-card,
.el-steps,
.el-tabs {
  margin-top: 15px;
}
img {
  width: 100%;
  height: 100%;
}
.quillEditor {
  height: 400px;
}
.addBtn {
  margin-top: 60px;
}
</style>
