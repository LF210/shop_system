<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addDialog=true">添加角色</el-button>
      <!-- 角色表格 -->
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scoped">
            <el-row
              style="marginTop:15px;borderTop:1px solid #eee"
              v-for="(item1,index1) in scoped.row.children"
              :key="index1"
            >
              <el-col :span="5">
                <el-tag
                  style="marginTop:10px;"
                  closable
                  @close="delTag(scoped.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right" style="marginLeft:10px;"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  style="marginTop:15px;"
                  v-for="(item2,index2) in item1.children"
                  :key="index2"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="delTag(scoped.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right" style="marginLeft:10px;"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      style="marginLeft:15px;"
                      type="info"
                      v-for="(item3,index3) in item2.children"
                      :key="index3"
                      closable
                      @close="delTag(scoped.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="600"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="600"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scoped.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scoped.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="dist(scoped.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="修改角色" :visible.sync="editDialog" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="distDialog" width="50%">
      <el-tree
        :data="treeData"
        ref="treeRef"
        :props="treeProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :default-checked-keys="checkArr"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distDialog = false">取 消</el-button>
        <el-button type="primary" @click="distSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/rolesList.js"></script>

<style lang="less" scoped>
.el-card,
.el-table {
  margin-top: 15px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
