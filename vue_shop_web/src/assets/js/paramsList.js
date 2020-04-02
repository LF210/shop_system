export default {
    data() {
        return {
            // 级联列表的配置项
            cascaderProps: {
                expandTrigger: 'hover',
                label: "cat_name",
                value: "cat_id"
            },
            // 级联列表选中项
            cascaderValue: [],
            // 级联列表数据
            selectOptions: [],
            // 添加按钮的禁用
            btnDisabled: true,
            // 参数ID
            paramsID: "",
            // 动态参数
            manyList: [],
            // 静态属性
            onlyList: [],
            // tab切换页的值
            activeName: "many",
            // 修改编辑弹框
            editVisible: false,
            // 编辑表单数据
            editForm: {
                data: "",
            },
            // 修改参数的属性ID
            editID: "",
            // 修改参数的分类ID
            editflID: "",
            // 修改参数的表单校验
            editRules: {
                data: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }]
            },
            // 添加参数的弹出框
            addVisible: false,
            // 添加参数的数据
            addForm: {
                data: ""
            },
            // 添加参数的表单校验
            addRules: {
                data: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }]
            },
            inputVisible: false,
            inputValue: ''
        }
    },
    methods: {
        // 获取商品分类数据
        async getcategoriesList() {
            const {
                data: res
            } = await this.$http.get('categories')
            this.selectOptions = res.data
        },
        // 阻止选取非三级分类的商品
        cascChange() {
            if (this.cascaderValue.length !== 3) {
                this.manyList = []
                this.onlyList = []
                this.cascaderValue = []
                this.btnDisabled = true
            } else {
                this.paramsID = this.cascaderValue[2]
                this.getList()
                this.btnDisabled = false
            }
        },
        async getList() {
            const {
                data: res1
            } = await this.$http.get(`categories/${this.paramsID}/attributes`, {
                params: {
                    sel: "many"
                }
            })
            const {
                data: res2
            } = await this.$http.get(`categories/${this.paramsID}/attributes`, {
                params: {
                    sel: "only"
                }
            })
            this.manyList = res1.data
            this.onlyList = res2.data
            this.manyList.forEach(item => item.attr_vals = item.attr_vals.split(","))
            this.onlyList.forEach(item => item.attr_vals = item.attr_vals.split(","))
        },
        // 删除参数
        async del(id, cid) {
            let result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error);
            if (result == 'confirm') {
                const {
                    data: res
                } = await this.$http.delete(`categories/${cid}/attributes/${id}`)
                this.getList()
                this.$message.success("删除成功")
            } else {
                this.$message.error("已取消删除")
            }
        },
        // 回显参数
        async edit(id, cid) {
            this.editID = id
            this.editflID = cid
            this.editVisible = true
            const {
                data: res
            } = await this.$http.get(`categories/${cid}/attributes/${id}`, {
                params: {
                    attr_sel: this.activeName
                }
            })
            this.editForm.data = res.data.attr_name
        },
        // 修改参数
        changeSure() {
            this.$refs.editRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.put(`categories/${this.editflID}/attributes/${this.editID}`, {
                    attr_name: this.editForm.data,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.getList()
                this.editVisible = false
                this.$refs.editRef.resetFields()
                this.$message.success(res.meta.msg)
            })
        },
        // 删除标签
        async tagClose(user, index) {
            user.attr_vals.splice(index, 1)
            const {
                data: res
            } = await this.$http.put(`categories/${user.cat_id}/attributes/${user.attr_id}`, {
                attr_name: user.attr_name,
                attr_sel: user.attr_sel,
                attr_vals: user.attr_vals.join(",")
            })
            if (res.meta.status !== 200) return this.$message.error("删除失败")
            this.$message.success("删除成功")
        },
        // 添加参数/属性
        add() {
            this.$refs.addRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.post(`categories/${this.paramsID}/attributes`, {
                    attr_name: this.addForm.data,
                    attr_sel: this.activeName,
                })
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.getList()
                this.addVisible = false
                this.$refs.addRef.resetFields()
                this.$message.success(res.meta.msg)
            })
        },
        // 显示文本框
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 提交
        async handleInputConfirm(user) {
            if (this.inputValue) {
                if (user.attr_vals.length == 1 && user.attr_vals[0] == "") {
                    user.attr_vals[0] = this.inputValue
                } else {
                    user.attr_vals.push(this.inputValue)
                }
                const {
                    data: res
                } = await this.$http.put(`categories/${user.cat_id}/attributes/${user.attr_id}`, {
                    attr_name: user.attr_name,
                    attr_sel: user.attr_sel,
                    attr_vals: user.attr_vals.join(",")
                })
                if (res.meta.status !== 200) return this.$message.error("添加失败")
                this.$message.success("添加成功")
            }
            this.inputVisible = false;
            this.inputValue = "";
        }
    },
    created() {
        this.getcategoriesList()
    }
}