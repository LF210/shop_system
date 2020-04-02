export default {
    data() {
        return {
            // 选项卡的所在位置
            activeName: 0,
            // 添加商品的数据
            addForm: {
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: []
            },
            // 添加商品的表单校验
            addRules: {
                goods_name: [{
                    required: true,
                    message: "商品名称不能为空",
                    trigger: "blur"
                }],
                goods_price: [{
                    required: true,
                    message: "商品价格不能为空",
                    trigger: "blur"
                }],
                goods_weight: [{
                    required: true,
                    message: "商品重量不能为空",
                    trigger: "blur"
                }],
                goods_number: [{
                    required: true,
                    message: "商品数量不能为空",
                    trigger: "blur"
                }],
            },
            // 商品分类的数据
            selectOptions: [],
            // 级联列表的配置项
            cascaderProps: {
                expandTrigger: 'hover',
                label: "cat_name",
                value: "cat_id"
            },
            // 选中项的ID
            cascID: "",
            // 动态参数
            manyList: [],
            // 静态属性
            onlyList: [],
            // 图片预览弹出框
            imgVisible: false,
            // 图片预览地址
            imgSrc: "",
            // 图片上传请求头
            uploadHeaders: {
                Authorization: window.sessionStorage.getItem("token")
            }
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
            if (this.addForm.goods_cat.length !== 3) return this.addForm.goods_cat = []
            this.cascID = this.addForm.goods_cat[2]
        },
        // 监听tab切换的函数
        async tabClick() {
            if (this.activeName == 1) {
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cascID}/attributes`, {
                    params: {
                        sel: 'many'
                    }
                })
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.split(" ")
                })
                this.manyList = res.data
            } else if (this.activeName == 2) {
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cascID}/attributes`, {
                    params: {
                        sel: 'only'
                    }
                })
                this.onlyList = res.data
            }
        },
        // 图片预览
        imgPreview(file) {
            this.imgVisible = true
            this.imgSrc = file.url
        },
        // 图片上传成功的回调
        imgSuccess(response, file, fileList) {
            this.addForm.pics.push({
                pic: response.data.tmp_path
            })
        },
        // 移除图片的回调
        imgRemove(file, fileList) {
            let index = this.addForm.pics.findIndex(item => item.pic === file.response.data.tmp_path)
            this.addForm.pics.splice(index, 1)
        },
        // 添加商品
        addGoods() {
            this.$refs.addRef.validate(async valid => {
                if (!valid) return this.$message.error("请先完善商品信息")
                const form = this._.cloneDeep(this.addForm)
                this.manyList.forEach(item => form.attrs.push({
                    attr_id: item.attr_id,
                    attr_vals: item.attr_vals.join(",")
                }))
                this.onlyList.forEach(item => form.attrs.push({
                    attr_id: item.attr_id,
                    attr_vals: item.attr_vals
                }))
                form.goods_cat = form.goods_cat.join(",")
                const {
                    data: res
                } = await this.$http.post("goods", form)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success("添加商品成功")
                this.$refs.addRef.resetFields()
                this.$router.push("/goods")
            })
        }
    },
    created() {
        this.getcategoriesList()
    },
}