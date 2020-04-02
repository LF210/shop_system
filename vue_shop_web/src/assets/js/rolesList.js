export default {
    data() {
        return {
            // 角色列表数据
            roleList: [],
            // 修改角色数据
            editForm: {
                roleName: "",
                roleDesc: ""
            },
            // 修改角色ID
            editID: "",
            // 修改角色弹出框
            editDialog: false,
            // 修改角色表单校验
            editRules: {
                roleName: [{
                    required: true,
                    message: "角色名不能为空",
                    trigger: "blur"
                }],
                roleDesc: [{
                    required: true,
                    message: "角色名不能为空",
                    trigger: "blur"
                }]
            },
            // 分配权限弹出框
            distDialog: false,
            // 树形列表数据
            treeData: [],
            // 树形列表显示规则
            treeProps: {
                label: "authName",
                children: "children"
            },
            // 默认选中的节点的数组
            checkArr: [],
            // 分配角色的ID
            userID: "",
            // 添加角色的弹出框
            addDialog: false,
            // 添加角色的数据
            addForm: {
                roleName: "",
                roleDesc: ""
            },
            // 添加角色的表单校验
            addRules: {
                roleName: [{
                    required: true,
                    message: "请输入角色名称",
                    trigger: "blur"
                }],
                roleDesc: [{
                    required: true,
                    message: "请输入角色描述",
                    trigger: "blur"
                }]
            }
        }
    },
    methods: {
        // 获取列表数据
        async getRoleList() {
            const {
                data: res
            } = await this.$http.get("roles")
            this.roleList = res.data
        },
        // 回显
        async edit(id) {
            this.editID = id
            this.editDialog = true
            const {
                data: res
            } = await this.$http.get(`roles/${id}`)
            this.editForm = res.data
        },
        // 修改角色
        changeSure() {
            this.$refs.editRef.validate(async valid => {
                if (!valid) return false
                const {
                    data: res
                } = await this.$http.put(`roles/${this.editID}`, this.editForm)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.getRoleList()
                this.editDialog = false
                this.$message.success("修改成功")
                this.$refs.editRef.resetFields()
            })
        },
        // 删除角色
        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http.delete(`roles/${id}`).then(() => {
                    this.getRoleList()
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
        // 分配权限
        async dist(user) {
            this.userID = user.id
            this.distDialog = true
            const {
                data: res
            } = await this.$http.get("rights/tree")
            this.treeData = res.data
            let key = []
            this.findKey(user, key)
            this.checkArr = key
        },
        // 递归寻找ID
        findKey(findArr, keyArr) {
            if (!findArr.children) {
                return keyArr.push(findArr.id)
            }
            findArr.children.forEach(item => this.findKey(item, keyArr))
        },
        // 修改角色权限
        async distSure() {
            let checkKeys = this.$refs.treeRef.getCheckedKeys()
            let halfCheckKeys = this.$refs.treeRef.getHalfCheckedKeys()
            let newArr = checkKeys.concat(halfCheckKeys)
            let newStr = newArr.join(",")
            const {
                data: res
            } = await this.$http.post(`roles/${this.userID}/rights`, {
                rids: newStr
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success("修改成功")
            this.distDialog = false
            this.getRoleList()
        },
        // 删除指定权限
        async delTag(user, id) {
            const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error);
            if (result == 'cancel') return this.$message.info("已取消删除")
            if (result == 'confirm') {
                const {
                    data: res
                } = await this.$http.delete(`roles/${user.id}/rights/${id}`)
                user.children = res.data
                this.$message.success("删除成功")
            }
        },
        // 添加角色
        add() {
            this.$refs.addRef.validate(async valide => {
                if (!valide) return false
                const {
                    data: res
                } = await this.$http.post("roles", this.addForm)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.getRoleList()
                this.addDialog = false
                this.$refs.addRef.resetFields()
                this.$message.success("添加成功")
            })
        }
    },
    created() {
        this.getRoleList()
    }
}