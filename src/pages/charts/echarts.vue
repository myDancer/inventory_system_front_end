<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                account:[],
                month:[],
                accountIn:[],
                accountout:[],
                profit:[]
            }
        },
        methods:{
            getAccount(){
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                let url = '/api/inventory/searchLatestAccount'
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.account = response.data.data
                        for(var i in this.account){
                            this.month.push(this.account[i].account_date)
                            this.accountIn.push(this.account[i].account_in)
                            this.accountout.push(this.account[i].account_out)
                            this.profit.push(this.account[i].account_profit)
                        }
                        this.chartLine.setOption({
                            title: {
                                text: '账务分析'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['收入', '支出', '利润']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: this.month
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: '收入',
                                    type: 'line',
                                    stack: '总量',
                                    data: this.accountIn
                                },
                                {
                                    name: '支出',
                                    type: 'line',
                                    stack: '总量',
                                    data: this.accountout
                                },
                                {
                                    name: '利润',
                                    type: 'line',
                                    stack: '总量',
                                    data:this.profit
                                }
                            ]
                        });
                        console.log(this.month)
                        console.log(this.accountIn)
                    } else {
                        this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
                    }
			    }, response => {
					console.log('error submit!!');
					return false;
				});
            },
            
        },
        mounted: function () {
            this.getAccount()
            var _this = this;
            //基于准备好的dom，初始化echarts实例
            this.chartColumn = echarts.init(document.getElementById('chartColumn'));
            this.chartBar = echarts.init(document.getElementById('chartBar'));
            this.chartLine = echarts.init(document.getElementById('chartLine'));
            this.chartPie = echarts.init(document.getElementById('chartPie'));
            this.chartLine.setOption({
                title: {
                    text: '账务分析'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['收入', '支出', '利润']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.month
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        stack: '总量',
                        data: this.accountIn
                    },
                    {
                        name: '支出',
                        type: 'line',
                        stack: '总量',
                        data: this.accountout
                    },
                    {
                        name: '利润',
                        type: 'line',
                        stack: '总量',
                        data:this.profit
                    }
                ]
            });
            this.chartColumn.setOption({
                title: { text: 'Column Chart' },
                tooltip: {},
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });

            this.chartBar.setOption({
                title: {
                    text: 'Bar Chart',
                    subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['2011年', '2012年']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: [18203, 23489, 29034, 104970, 131744, 630230]
                    },
                    {
                        name: '2012年',
                        type: 'bar',
                        data: [19325, 23438, 31000, 121594, 134141, 681807]
                    }
                ]
            });


            this.chartPie.setOption({
                title: {
                    text: 'Pie Chart',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                            { value: 1548, name: '搜索引擎' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }

    }

</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/
    
    .el-col {
        padding: 30px 20px;
    }
</style>