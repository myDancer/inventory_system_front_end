<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="20">
                <div id="chartLine" style="width:100%; height:400px;"></div>
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
            }
        },
        mounted: function () {
            this.getAccount()
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