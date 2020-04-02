<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="userListCard">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="usersList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="280"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="switchChange(scoped.row.id,scoped.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scoped.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scoped.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="dist(scoped.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialog" width="50%">
      <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog title="分配角色" :visible.sync="distDialog" width="50%">
      <div>当前的用户：{{distInfo.username}}</div>
      <br />
      <div>当前的角色：{{distInfo.role_name}}</div>
      <br />
      <div>
        分配新角色：
        <el-select v-model="newDist" placeholder="请选择">
          <el-option
            v-for="(item,index) in distList"
            :key="index"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distDialog = false">取 消</el-button>
        <el-button type="primary" @click="distSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/usersList.js"></script>

<style lang="less" scoped>
.userListCard,
.block,
.el-table {
  margin-top: 15px;
}
</style>
