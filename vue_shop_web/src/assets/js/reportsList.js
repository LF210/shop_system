// 引入echarts
import echarts from 'echarts'
export default {
    async mounted() {
        const {
            data: res
        } = await this.$http.get("reports/type/1")
        let obj = {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                boundaryGap: false
            }],
            yAxis: [{
                type: 'value'
            }]
        }
        let newData = this._.merge(res.data, obj)
        // 指定图表的配置项和数据
        let myChart = echarts.init(this.$refs.main);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(newData);
    },
}