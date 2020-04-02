export default {
    data() {
        return {
            // 查询参数
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 10
            },
            // 表格数据
            tableData: [],
            // 数据总条数
            total: 0,
            // 修改商品弹出框
            editDialog: false,
            // 修改商品的Id
            editID: "",
            // 修改商品的数据
            editForm: {
                goods_name: "",
                goods_price: "",
                goods_number: "",
                goods_weight: ""
            },
            // 修改商品的表单校验
            editRules: {
                goods_name: [{
                    required: true,
                    message: "请输入商品名称",
                    trigger: "blur"
                }],
                goods_price: [{
                    required: true,
                    message: "请输入商品价格",
                    trigger: "blur"
                }],
                goods_number: [{
                    required: true,
                    message: "请输入商品数量",
                    trigger: "blur"
                }],
                goods_weight: [{
                    required: true,
                    message: "请输入商品重量",
                    trigger: "blur"
                }],
            }
        }
    },
    methods: {
        // 获取数据
        async getGoodList() {
            const {
                data: res
            } = await this.$http.get("goods", {
                params: this.queryInfo
            })
            this.tableData = res.data.goods
            this.total = res.data.total
        },
        // 改变每页显示数据条数
        sizeChange(size) {
            this.queryInfo.pagesize = size
            this.getGoodList()
        },
        // 改变页码
        currentChange(num) {
            this.queryInfo.pagenum = num
            this.getGoodList()
        },
        // 搜索
        search() {
            this.getGoodList()
        },
        // 删除
        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http.delete(`goods/${id}`).then(() => {
                    this.getGoodList()
                })
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 回显
        async edit(id) {
            this.editDialog = true
            this.editID = id
            const {
                data: res
            } = await this.$http.get(`goods/${id}`)
            this.editForm = res.data
        },
        // 修改
        changeSure() {
            this.$refs.editRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.put(`goods/${this.editID}`, this.editForm)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.getGoodList()
                this.editDialog = false
                this.$refs.editRef.resetFields()
                this.$message.success("修改成功")
            })
        },
        // 跳转到添加商品页面
        toAdd() {
            this.$router.push("/goodsAdd")
        }
    },
    created() {
        this.getGoodList()
    },
}