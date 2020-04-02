export default {
    data() {
        return {
            // 表格数据
            tableData: []
        }
    },
    methods: {
        async getRightList() {
            const {
                data: res
            } = await this.$http.get("rights/list")
            this.tableData = res.data
        }
    },
    created() {
        this.getRightList()
    },
}