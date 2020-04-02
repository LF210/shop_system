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
      <!-- 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 级联列表 -->
      <div class="block">
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
          v-model="cascaderValue"
          :options="selectOptions"
          :props="cascaderProps"
          @change="cascChange"
        ></el-cascader>
        <!-- tab切换 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              size="mini"
              :disabled="btnDisabled"
              @click="addVisible=true"
            >添加参数</el-button>
            <!-- 数据表格 -->
            <el-table :data="manyList" border>
              <el-table-column type="expand">
                <template slot-scope="scoped">
                  <el-tag
                    v-for="(tag,index) in scoped.row.attr_vals"
                    :key="index"
                    :style="tag==''?'display:none;marginLeft:15px;':'display:inline-block;marginLeft:15px;'"
                    closable
                    @close="tagClose(scoped.row,index)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scoped.row)"
                    @blur="handleInputConfirm(scoped.row)"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="edit(scoped.row.attr_id,scoped.row.cat_id)"
                  >修改</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="del(scoped.row.attr_id,scoped.row.cat_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="mini"
              :disabled="btnDisabled"
              @click="addVisible=true"
            >添加属性</el-button>
            <!-- 数据表格 -->
            <el-table :data="onlyList" border>
              <el-table-column type="expand">
                <template slot-scope="scoped">
                  <el-tag
                    v-for="(tag,index) in scoped.row.attr_vals"
                    :key="index"
                    :style="tag==''?'display:none;marginLeft:15px;':'display:inline-block;marginLeft:15px;'"
                    closable
                    @close="tagClose(scoped.row,index)"
                  >{{tag}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scoped.row)"
                    @blur="handleInputConfirm(scoped.row)"
                  ></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="edit(scoped.row.attr_id,scoped.row.cat_id)"
                  >修改</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="del(scoped.row.attr_id,scoped.row.cat_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 编辑修改 -->
    <el-dialog
      :title="activeName=='many'?'修改动态参数':'修改静态属性'"
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form :model="editForm" label-width="80px" :rules="editRules" ref="editRef">
        <el-form-item prop="data" :label="activeName=='many'?'动态参数':'静态属性'">
          <el-input v-model="editForm.data"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加参数/属性 -->
    <el-dialog :title="activeName=='many'?'添加动态参数':'添加静态属性'" :visible.sync="addVisible" width="50%">
      <el-form :model="addForm" label-width="80px" :rules="addRules" ref="addRef">
        <el-form-item prop="data" :label="activeName=='many'?'动态参数':'静态属性'">
          <el-input v-model="addForm.data"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/paramsList.js"></script>

<style lang="less" scoped>
.el-card,
.block,
.el-tabs,
.el-table {
  margin-top: 15px;
}
.demonstration {
  margin-right: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
