export default {
    data() {
        let checkEmail = (rule, value, callback) => {
            if (!value) return callback(new Error("请输入您的邮箱"));
            if (
                /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
                    value
                )
            ) {
                callback();
            } else {
                callback(new Error("您的邮箱格式不正确"));
            }
        };
        return {
            // 用户列表数据
            usersList: [],
            // 用户列表请求参数
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5
            },
            // 数据总条数
            total: 0,
            // 添加用户弹出框显示
            addDialog: false,
            // 添加用户数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            // 添加用户表单验证
            addRules: {
                username: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                email: [{
                        required: true,
                        message: "数据不能为空",
                        trigger: "blur"
                    },
                    {
                        validator: checkEmail,
                        trigger: "blur"
                    }
                ],
                mobile: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }]
            },
            // 修改用户弹出框
            editDialog: false,
            // 修改用户ID
            editID: "",
            // 修改用户数据
            editForm: {
                username: "",
                password: "",
                email: ""
            },
            // 修改用户表单校验
            editRules: {
                username: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "数据不能为空",
                    trigger: "blur"
                }],
                email: [{
                        required: true,
                        message: "数据不能为空",
                        trigger: "blur"
                    },
                    {
                        validator: checkEmail,
                        trigger: "blur"
                    }
                ]
            },
            // 分配角色弹框显示
            distDialog: false,
            // 分配角色数据
            distInfo: {
                // 分配角色当前的用户
                username: "",
                // 分配角色当前的角色
                role_name: ""
            },
            // 角色列表数据
            distList: [],
            // 选中的角色
            newDist: "",
            // 分配的角色ID
            distID: ""
        };
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const {
                data: res
            } = await this.$http.get("users", {
                params: this.queryInfo
            });
            this.usersList = res.data.users;
            this.total = res.data.total;
        },
        // 改变每页显示数据条数
        sizeChange(size) {
            this.queryInfo.pagesize = size;
            this.getUserList();
        },
        // 改变当前页码
        currentChange(num) {
            this.queryInfo.pagenum = num;
            this.getUserList();
        },
        // 搜索
        search() {
            this.getUserList();
        },
        // 修改用户状态
        async switchChange(uid, type) {
            const {
                data: res
            } = await this.$http.put(`users/${uid}/state/${type}`);
            if (res.meta.status === 200) {
                return this.$message.success("修改用户状态成功");
            }
        },
        // 添加用户
        add() {
            this.$refs.addRef.validate(async valid => {
                if (!valid) return false;
                const {
                    data: res
                } = await this.$http.post("users", this.addForm);
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                this.getUserList();
                this.addDialog = false;
                this.$refs.addRef.resetFields();
                this.$message.success("添加用户成功");
            });
        },
        // 删除用户
        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http.delete(`users/${id}`).then(() => {
                    this.getUserList()
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
        // 回显用户
        async edit(id) {
            this.editID = id
            this.editDialog = true
            const {
                data: res
            } = await this.$http.get(`users/${id}`)
            this.editForm = res.data
        },
        // 编辑用户
        changeSure() {
            this.$refs.editRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.put(`users/${this.editID}`, this.editForm)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$refs.editRef.resetFields()
                this.editDialog = false
                this.getUserList()
                this.$message.success("修改用户成功")
            })
        },
        // 分配用户角色
        async dist(users) {
            this.distID = users.id
            this.distDialog = true
            this.distInfo = users
            const {
                data: res
            } = await this.$http.get("roles")
            this.distList = res.data
        },
        // 确定分配角色
        async distSure() {
            if (!this.newDist) return this.$message.error("请选中一个角色")
            const {
                data: res
            } = await this.$http.put(`users/${this.distID}/role`, {
                rid: this.newDist
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.distDialog = false
            this.getUserList()
            this.$message.success("分配角色成功")
            this.newDist = ""
        }
    },
    created() {
        this.getUserList();
    }
};