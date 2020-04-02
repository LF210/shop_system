<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="orderData" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="900"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.order_pay ==0" type="warning">未付款</el-tag>
            <el-tag v-else type="danger">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="150">
          <template slot-scope="scoped">{{scoped.row.create_time | dataForm}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scoped.row.order_id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-message"
              size="mini"
              @click="adressdialog = true"
            ></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showLogistics"></el-button>
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
    <!-- 编辑订单状态弹框 -->
    <el-dialog title="修改订单状态" :visible.sync="editDialog" width="50%">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="90px">
        <el-form-item label="是否发货" prop="is_send">
          <el-select v-model="is_send_value" placeholder="请选择" style="width:830px;">
            <el-option
              v-for="item in is_send_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="order_pay">
          <el-select v-model="order_pay_value" placeholder="请选择" style="width:830px;">
            <el-option
              v-for="item in order_pay_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="editForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="订单数量" prop="order_number">
          <el-input v-model="editForm.order_number"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="pay_status_value" placeholder="请选择" style="width:830px;">
            <el-option
              v-for="item in pay_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改地址弹出框 -->
    <el-dialog title="修改地址" :visible.sync="adressdialog" width="50%">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="90px">
        <el-form-item prop="address" label="省市区/县">
          <el-cascader
            style="width:830px;"
            v-model="selectValue"
            :options="city"
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adressdialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息弹出框 -->
    <el-dialog title="查看物流进度" :visible.sync="Logisticsdialog" width="50%">
      <el-steps direction="vertical" :active="0">
        <el-step
          v-for="item in Logistics"
          :key="item.id"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script src="../assets/js/ordersList.js"></script>

<style lang="less" scoped>
.el-card,
.el-table,
.block {
  margin-top: 15px;
}
</style>
