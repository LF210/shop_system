export default {
    data() {
        return {
            // 表格数据
            tableData: [],
            // 获取表格数据参数
            queryInfo: {
                type: [1, 2, 3],
                pagenum: 1,
                pagesize: 5
            },
            // 数据总条数
            total: 0,
            // 表格配置项
            columns: [{
                    label: "分类名称",
                    prop: "cat_name"
                },
                {
                    label: "是否有效",
                    type: "template",
                    template: "isOK"
                },
                {
                    label: "排序",
                    type: "template",
                    template: "sort"
                },
                {
                    label: "操作",
                    type: "template",
                    template: "doSomething"
                }
            ],
            // 编辑ID
            editID: "",
            // 编辑弹出框
            editDialogVisible: false,
            // 编辑数据
            editForm: {
                cat_name: ""
            },
            // 编辑表单校验
            editRules: {
                cat_name: [{
                    required: true,
                    message: "分类名称不能为空",
                    trigger: "blur"
                }]
            },
            // 添加数据弹框
            addDialogVisible: false,
            // 添加数据
            addForm: {
                cat_name: "",
                cat_pid: 0,
                cat_level: 0
            },
            // 添加表单校验
            addRules: {
                cat_name: [{
                    required: true,
                    message: "分类名称不能为空",
                    trigger: "blur"
                }]
            },
            // 级联列表选中项
            selectValue: [],
            // 级联列表数据
            cascaderOptions: [],
            // 级联列表配置项
            cascProp: {
                expandTrigger: 'hover',
                label: "cat_name",
                value: "cat_id"
            },
        }
    },
    methods: {
        // 获取表格数据
        async getTableData() {
            const {
                data: res
            } = await this.$http.get("categories", {
                params: this.queryInfo
            })
            this.tableData = res.data.result
            this.total = res.data.total
        },
        // 改变页码
        currentChange(num) {
            this.queryInfo.pagenum = num
            this.getTableData()
        },
        // 改变每页显示数据条数
        sizeChange(size) {
            this.queryInfo.pagesize = size
            this.getTableData()
        },
        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http.delete(`categories/${id}`).then(() => {
                    this.getTableData()
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
            this.editDialogVisible = true
            this.editID = id
            const {
                data: res
            } = await this.$http.get(`categories/${id}`)
            this.editForm = res.data
        },
        // 修改
        changeSure() {
            this.$refs.editRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.put(`categories/${this.editID}`, this.editForm)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.getTableData()
                this.editDialogVisible = false
                this.$message.success("修改成功")
                this.$refs.editRef.resetFields()
            })
        },
        // 获取数据
        async getcategoriesList() {
            const {
                data: res
            } = await this.$http.get('categories', {
                params: {
                    type: 2
                }
            })
            this.cascaderOptions = res.data
        },
        // 级联列表选中项发生变化时的函数
        cascaderChange() {
            if (this.selectValue) {
                this.addForm.cat_pid = this.selectValue[this.selectValue.length - 1]
                this.addForm.cat_level = this.selectValue.length
            } else {
                this.addForm.cat_pid = 0
                this.addForm.cat_level = 0
            }
        },
        // 添加数据
        add() {
            this.$refs.addRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.post(`categories`, this.addForm)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.getTableData()
                this.addDialogVisible = false
                this.$message.success("添加成功")
                this.$refs.addRef.resetFields()
            })
        }
    },
    created() {
        this.getTableData()
        this.getcategoriesList()
    },
}