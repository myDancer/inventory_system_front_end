<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="采购清单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRuku">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newRukudetail">新增</el-button>
                    <el-button type="danger"@click.native="modifyRukudetail()">审核入库</el-button>
                    <el-button type="warning"@click.native="deleteRukudetail">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="ruku" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange" border>
				<el-table-column prop="ruku_id" label="采购订单编号" width="150" sortable>
				</el-table-column>
				<el-table-column prop="time" label="订单日期" width="120" sortable>
				</el-table-column>
				<el-table-column prop="supplier_name" label="供应商" width="100"  sortable>
				</el-table-column>
				<el-table-column prop="ruku_operator" label="采购员" width="120" sortable>
				</el-table-column>
				<el-table-column prop="field0" label="入库状态" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="ruku_time" label="到货日期" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="ruku_remark" label="备注" min-width="180" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog :title="dialogtitle" v-model="rukudetailDialogVisible" size="large">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
				<el-row>
					<el-col :span="6">
                    <el-form-item label="供应商" prop="supplier">
						 <el-select v-model="ruleForm.supplier_id" placeholder="选择供应商"  :disabled="!saveOrchange">
                            <el-option
                            v-for="item in supplieroptions"
                            :label="item.supplier_name"
                            :value="item.supplier_id">
                            </el-option>
                        </el-select>
					</el-form-item>
                    </el-col>
					<el-col :span="7"><el-form-item label="采购单号" prop="ruku_id">
						<el-input v-model="ruleForm.ruku_id" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
                    <el-col :span="6"><el-form-item label="总金额" prop="ruku_total">
						<el-input v-model="ruleForm.ruku_total" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
                <el-col :span="6"><el-form-item label="采购员" prop="ruku_operator">
						<el-input v-model="ruleForm.ruku_operator":disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="7"><el-form-item label="订单日期" prop="time">
                        <el-date-picker v-model="ruleForm.time"  type="date"  placeholder="订单日期"  :disabled="!saveOrchange">
                        </el-date-picker>
					</el-form-item></el-col>
					<el-col :span="8"><el-form-item label="到货日期" prop="ruku_time">
						<el-date-picker v-model="ruleForm.ruku_time"  type="date"  placeholder="到货日期"  :disabled="!saveOrchange">
                        </el-date-picker>
					</el-form-item></el-col>
				</el-row>
				<el-row>
                <el-col :span="12">
                    <el-form-item label="备注" prop="ruku_remark">
                        <el-input  type="textarea"  :rows="2"  placeholder="请输入备注"  v-model="ruleForm.ruku_remark"></el-input>
                    </el-form-item>
                    </el-col>
                <el-col :span="12">
                    <el-form-item label="入库状态" prop="state">
                         <el-select v-model="ruleForm.field0" placeholder="选择状态">
							<el-option v-for="item in options" :label="item.label"  :value="item.value">
							</el-option>
						</el-select>
                    </el-form-item>
                    </el-col>
                </el-row>
				<div v-for="(item, index) in commodityTable" >
					<el-button @click="addrows" style="float:left;margin-top:5px;">增加</el-button>
                    <table class="commodityTable" style="float:left">
                        <tr>
                            <th>商品编号</th>
							<th>仓库编号</th>
                            <th>商品名称</th>
                            <th>商品类别</th>
                            <th>品牌</th>
                            <th>计量单位</th>
                            <th>数量</th>
                            <th>价格</th>
                            <th>总金额</th>
                            <th>备注</th>
                        </tr>
                        <tr>
                            <td>
							 <el-autocomplete class="inline-input"  v-model="item.commodity_id" :fetch-suggestions="querySearch"
      placeholder="点击获取" @select="handleSelect" @click.native="sendindex(index)"  :disabled="!saveOrchange"></el-autocomplete>
							</td>
							<td>
							 <el-autocomplete class="inline-input"  v-model="item.storage_id" :fetch-suggestions="storagequerySearch"
      placeholder="点击获取" @select="storagehandleSelect"  @click.native="sendindex(index)" :disabled="!saveOrchange"></el-autocomplete>
							</td>
                            <td><input v-model="item.commodity_name" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.categoryName" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.brand" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.unitname" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.amount" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.price" :disabled="!saveOrchange"></input></td>
                            <td style="text-align:center">{{item.amountprice = item.amount*item.price}}</td>
                            <td><input v-model="item.rukudetail_remark" :disabled="!saveOrchange"></input></td>
                        </tr>
						</table>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addRukudetail()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeRukudetail()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')" v-if="saveOrchange">重置</el-button>
					<el-button @click="rukudetailDialogVisible=false"  v-else>取消</el-button>
				</div>
		</el-dialog>
		</template>

	</section>
</template>
<script>
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				index:'',
                supplieroptions:[],
				options:[
					{
					value:'未入库',
					label:'未入库'
					},{
					value:'已入库',
					label:'已入库'
					}
				],
				loading: false,
				saveOrchange:false,
				dialogtitle:'',
				commodity:[],
				ruku: [],
                rukudetailDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    supplier_id:'',
                    time:'',
					ruku_time:'',
                    ruku_id:'',
                    ruku_total:'',
                    ruku_operator:'',
                    ruku_remark:'',
					field0:''
                },
				storage:[],
				commodityArray:[],
				commodityTable:[{
					commodity_id:'',
					commodity_name:'',
					storage_id:'',
					category_id:'',
					brand:'',
					unit_id:'',
					amount:'',
					price:'',
					amountprice:0,
					rukudetail_remark:'',
					categoryName:''
				}],
                rules: {
				ruku_id: [
					{ required: true, message: '请输入采购单号', trigger: 'blur' },
				],
                supplier_id:[
					{ required: true, message: '请选择供应商', trigger: 'blur' },
                ]
                }
			}
		},
		methods: {
			sendindex(index){
				this.index = index
			},
			handleSelect(item) {
				console.log(item)
				this.getStorageFromStock(item.value)
				this.commodityTable[this.index].commodity_id = item.value
				this.commodityTable[this.index].commodity_name = item.commodity_name
				this.commodityTable[this.index].category_id = item.category_id
				this.commodityTable[this.index].categoryName = item.categoryName
				this.commodityTable[this.index].brand = item.brand
				this.commodityTable[this.index].unitname = item.unitname
			},
			storagehandleSelect(item){
				console.log(item)
				this.commodityTable[this.index].storage_id = item.value
				this.commodityTable[this.index].stock_id = item.stock_id
			},
			storagequerySearch(queryString, cb){
				var storage = this.storage;
				var results = queryString ? storage.filter(this.createFilter(queryString)) : storage;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			querySearch(queryString, cb) {
				var commodity = this.commodity;
				var results = queryString ? commodity.filter(this.createFilter(queryString)) : commodity;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
				return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
				};
			},
			addrows(){
				this.commodityTable.push({
					commodity_id:'',
					commodity_name:'',
					storage_id:'',
					category_id:'',
					brand:'',
					unit_id:'',
					amount:'',
					price:'',
					amountprice:0,
					rukudetail_remark:'',
					categoryName:''
				})
			},
			newRukudetail(){
				var user = JSON.parse(sessionStorage.getItem('user'));
				this.rukudetailDialogVisible=true
				this.dialogtitle="增加采购单"
				this.saveOrchange=true
				this.ruleForm ={
						supplier_id:'',
						time:Date.parse(new Date()),
						ruku_time:'',
						ruku_total:'',
						ruku_operator:user.username,
						ruku_id:'',
						ruku_remark:'',
						field0:'未入库'
					}
				this.commodityTable=[{
					commodity_id:'',
					commodity_name:'',
					storage_id:'',
					category_id:'',
					brand:'',
					unit_id:'',
					amount:'',
					price:'',
					amountprice:0,
					rukudetail_remark:'',
					categoryName:''
				}]
			},
            handleCurrentChange(val) {
			this.currentRow = val;
		    },
			getRuku: function () {
                let url
                if(this.filters.name){
                    url = '/api/inventory/searchRuku?ruku_id='+ this.filters.name
                } else {
                    url = '/api/inventory/searchRuku'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.ruku = response.data.data
                        this.loading = false;
                        NProgress.done();
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
            deleteRukudetail(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/inventory/deleteRuku?ruku_id=' + this.currentRow.ruku_id
					let url2 = '/api/inventory/deleteRukudetail?ruku_id=' + this.currentRow.ruku_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
						this.$http.get(url2).then(response => {
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getRuku()
							}, response => {
							console.log('error deleterukudetail!!');
							return false;
						});
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deleterukudetail!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addRukudetail(){
                let url = '/api/inventory/addRuku'
				let url2 = '/api/inventory/addRukudetail'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = new Date().Format("yyyy-MM-dd");
			var ruku_time = new Date(this.ruleForm.ruku_time).Format("yyyy-MM-dd")
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'ruku_id=' + this.ruleForm.ruku_id +
				'&supplier_id=' + this.ruleForm.supplier_id +
				'&ruku_time='+ ruku_time +
				'&time=' + time +
				'&ruku_total=' + this.ruleForm.ruku_total+
				'&ruku_operator='+this.ruleForm.ruku_operator+
				'&ruku_remark='+this.ruleForm.ruku_remark +
				'&field0='+this.ruleForm.field0 
			console.log(parameter)
			var parameter2
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					for(var index in this.commodityTable){
						parameter2 = 'ruku_id=' + this.ruleForm.ruku_id + 
						'&commodity_id=' + this.commodityTable[index].commodity_id +
						'&storage_id=' + this.commodityTable[index].storage_id +
						'&amount=' + this.commodityTable[index].amount +
						'&price=' + this.commodityTable[index].price +
						'&amountprice=' + this.commodityTable[index].amountprice +
						'&rukudetail_remark=' + this.commodityTable[index].rukudetail_remark
						this.$http.post(url2,parameter2,{headers:header}).then(response => {
							console.log('succeed')
						}, response => {
							console.log('error submit!!');
							return false;
						});
						this.changeStock(this.ruleForm.field0,this.commodityTable[index].amount,this.commodityTable[index].stock_id)
					}
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.rukudetailDialogVisible = false
					this.getRuku()
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
			modifyRukudetail(){
			if(!this.currentRow){
				this.$message.error('请选择要审核的一列');
			} else{
				this.rukudetailDialogVisible=true
				this.dialogtitle='更改采购信息'
				this.saveOrchange = false
				this.ruleForm.supplier_id=this.currentRow.supplier_id
				this.ruleForm.time=this.currentRow.time
				this.ruleForm.ruku_time=this.currentRow.ruku_time
				this.ruleForm.ruku_id=this.currentRow.ruku_id
				this.ruleForm.ruku_total=this.currentRow.ruku_total
				this.ruleForm.ruku_operator=this.currentRow.ruku_operator
				this.ruleForm.ruku_remark=this.currentRow.ruku_remark
				this.ruleForm.field0=this.currentRow.field0
				this.searchRukudetail(this.currentRow.ruku_id)
			}
		},
		changeRukudetail(){
			 let url = '/api/inventory/modifyRuku'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'ruku_id=' + this.ruleForm.ruku_id +
				'&field0=' + this.ruleForm.field0 +
				'&ruku_remark='+this.ruleForm.ruku_remark
			for(var index in this.commodityTable){
				this.changeStock(this.ruleForm.field0,this.commodityTable[index].amount,this.commodityTable[index].stock_id)
			}
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.rukudetailDialogVisible = false
					this.getRuku()
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
            searchSupplier(){
                let url = '/api/management/searchSupplier'
                this.$http.get(url).then(response => {
                    this.supplieroptions = response.data.data
                }, response => {
                        console.log('error submit!!');
                        return false;
                    });
            },
			getCommodity: function () {
				let url = '/api/management/searchCommodities'
			this.$http.get(url).then(response => {
				if(response.data.errorcode === '200'){
					var resp = response.data.data
					for(var item in resp){
						this.commodity.push({
							value: resp[item].commodity_id,
							commodity_name:resp[item].commodity_name,
							category_id:resp[item].category_id,
							categoryName:resp[item].categoryName,
							brand:resp[item].brand,
							unit_id:resp[item].unit_id,
							unitname:resp[item].unitname
							})
						}
					console.log(resp)
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
			searchRukudetail(ruku){
				let url = '/api/inventory/searchRukudetail?ruku_id=' + ruku
                this.$http.get(url).then(response => {
					if(response.data.errorcode === '200'){
						console.log(response.data.data)
						this.commodityTable = response.data.data
					}
					}, response => {
					console.log('error submit!!');
					return false;
				});
			},
			getStorageFromStock(id){
				let url = '/api/inventory/getStorageFromStock?commodity_id=' + id
				this.$http.get(url).then(response => {
					if(response.data.errorcode === '200'){
						var resp = response.data.data
						for(var item in resp){
							this.storage.push({
								value: resp[item].storage_id,
								stock_id:resp[item].id
							})
						}
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
			changeStock(state,amount,stockId){
				if(state === '已入库'){
					let url = '/api/inventory/changeStockRukuamount?id='+ stockId +'&rukuamount='+ amount
					this.$http.get(url).then(response => {
					}, response => {
						console.log('error submit!!');
						return false;
					});
				}
			}
		},
		computed: {
		
		},
		mounted() {
			this.searchSupplier();
			this.getCommodity()
			this.getRuku()
		},
		
}
</script>

<style>
.commodityTable{
    width:90%;
}
.commodityTable th{border:solid #add9c0; border-width:1px 1px 1px 0px;width:70px;height:20px;}
.commodityTable td{border:solid #add9c0; border-width:0px 1px 1px 0px;width:70px;height:20px;}
.commodityTable table{border:solid #add9c0; border-width:1px 0px 0px 1px;}
.commodityTable input{border:0px;height:20px;width:100%}
</style>