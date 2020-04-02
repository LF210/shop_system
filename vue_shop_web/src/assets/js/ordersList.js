import city from './cityList'
export default {
    data() {
        return {
            // 查询数据参数
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5
            },
            // 数据总条数
            total: 0,
            // 订单数据
            orderData: [],
            // 改变地址弹出框
            adressdialog: false,
            // 级联列表配置项
            cascaderProps: {
                expandTrigger: 'hover'
            },
            // 级联列表选中项
            selectValue: "",
            // 级联列表数据
            city: city,
            // 详细地址
            addForm: {
                address: ""
            },
            // 详细地址表单校验
            addRules: {
                address: [{
                    required: true,
                    message: "请输入详细地址",
                    trigger: "blur"
                }]
            },
            // 物流进度弹出框
            Logisticsdialog: false,
            Logistics: [],
            // 修改数据弹框显示
            editDialog: false,
            // 修改数据ID
            updID: "",
            // 修改数据
            editForm: {
                is_send: "",
                order_pay: "",
                order_price: "",
                order_number: "",
                pay_status: ""
            },
            // 修改数据表单校验
            editFormRules: {
                is_send: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                order_pay: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                order_price: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                order_number: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                pay_status: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }]
            },
            // 是否发货
            is_send_options: [{
                    value: 1,
                    label: "已经发货"
                },
                {
                    value: 0,
                    label: "未发货"
                }
            ],
            is_send_value: "",
            // 订单支付方式
            order_pay_options: [{
                    value: 0,
                    label: "未支付"
                },
                {
                    value: 1,
                    label: "支付宝"
                },
                {
                    value: 2,
                    label: "微信"
                },
                {
                    value: 3,
                    label: "银行卡"
                }
            ],
            order_pay_value: "",
            // 支付状态
            pay_status_options: [{
                    value: 0,
                    label: "未付款"
                },
                {
                    value: 1,
                    label: "已付款"
                }
            ],
            pay_status_value: ""
        }
    },
    methods: {
        // 获取数据
        async getOrderList() {
            const {
                data: res
            } = await this.$http.get(`orders`, {
                params: this.queryInfo
            })
            this.orderData = res.data.goods
            this.total = res.data.total
        },
        // 搜索
        search() {
            this.getOrderList()
        },
        // 改变页码
        currentChange(num) {
            this.queryInfo.pagenum = num
            this.getOrderList()
        },
        // 改变每页显示数据条数
        sizeChange(size) {
            this.queryInfo.pagesize = size
            this.getOrderList()
        },
        // 修改地址
        changeSure() {
            this.$refs.addRef.resetFields()
            this.adressdialog = false
        },
        // 显示物流弹框
        showLogistics() {
            this.Logisticsdialog = true
            this.getLogistics()
        },
        // 获取物流信息
        async getLogistics() {
            const {
                data: res
            } = await this.$http.get(`/kuaidi/` + 619915933338)
            this.Logistics = res.data
        },
        // 回显
        async edit(id) {
            this.updID = id;
            this.editDialog = true;
            const {
                data: res
            } = await this.$http.get(`orders/${id}`);
            this.editForm = res.data;
            // 订单发货状态
            this.is_send_value =
                this.editForm.is_send == "否" ? "未发货" : "已经发货";
            // 订单支付方式
            if (this.editForm.order_pay == 0) {
                this.order_pay_value = "未支付";
            } else if (this.editForm.order_pay == 1) {
                this.order_pay_value = "支付宝";
            } else if (this.editForm.order_pay == 2) {
                this.order_pay_value = "微信";
            } else {
                this.order_pay_value = "银行卡";
            }
            // 订单支付状态
            this.pay_status_value =
                this.editForm.pay_status == 0 ? "未付款" : "已付款";
        },
        // 修改订单状态
        async changeSure() {
            this.editForm.is_send = this.is_send_value;
            this.editForm.order_pay = this.order_pay_value;
            this.editForm.pay_status = this.pay_status_value;
            const {
                data: res
            } = await this.$http.put(
                `orders/${this.updID}`,
                this.editForm
            );
            if (res.meta.status !== 201) return this.$message.error("更新数据失败");
            this.$refs.editFormRef.resetFields();
            this.$message.success("更新数据成功");
            this.getOrderList();
            this.editDialog = false;
        }
    },
    created() {
        this.getOrderList()
    },
}