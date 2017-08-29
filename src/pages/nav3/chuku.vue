<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="销售清单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getChuku">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newChuku">新增</el-button>
                    <el-button type="danger"@click.native="modifyChuku()">审核出库</el-button>
                    <el-button type="warning"@click.native="deleteChuku">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="chuku" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange">
				<el-table-column prop="chuku_id" label="订单编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chuku_date" label="订单日期" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chargePeople" label="购买客户" width="120"  sortable>
				</el-table-column>
				<el-table-column prop="chuku_operator" label="销售员" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chuku_total" label="总金额" width="120" sortable>
				</el-table-column>
				<el-table-column prop="field0" label="出库状态" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chuku_address" label="送货地址" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chuku_remark" label="备注" min-width="120" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog :title="dialogtitle" v-model="chukuDialogVisible"  size="large">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
				<el-row>
					<el-col :span="7"><el-form-item label="销售订单编号" prop="chuku_id">
						<el-input v-model="ruleForm.chuku_id":disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="7"><el-form-item label="订单日期" prop="chuku_date">
						<el-date-picker  v-model="ruleForm.chuku_date"  type="date"  placeholder="选择日期" :disabled="!saveOrchange">
    					</el-date-picker>
					</el-form-item></el-col>
					<el-col :span="8"><el-form-item label="购买客户" prop="customer_id">
						 <el-select v-model="ruleForm.customer_id" placeholder="请选择客户" :disabled="!saveOrchange">
							<el-option  v-for="item in customerOptions"  :label="item.chargePeople" :value="item.customer_id">
							</el-option>
						</el-select>
					</el-form-item></el-col>
				</el-row>
				<el-row>
				<el-col :span="7"><el-form-item label="销售员" prop="chuku_operator">
						<el-input v-model="ruleForm.chuku_operator" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="7"><el-form-item label="总金额" prop="chuku_total">
						<el-input v-model="ruleForm.chuku_total" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="7"><el-form-item label="送货地址" prop="chuku_address">
						<el-input v-model="ruleForm.chuku_address" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="14">
						<el-form-item label="备注" prop="chuku_remark">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入备注"  v-model="ruleForm.chuku_remark"></el-input>
						</el-form-item>
						</el-col>
						<el-col :span="8">
						<el-form-item label="出库状态" prop="state">
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
                            <th>销售数量</th>
                            <th>单价</th>
                            <th>金额</th>
                            <th>备注</th>
                        </tr>
                        <tr>
                            <td>
							 <el-autocomplete class="inline-input"  v-model="item.commodity_id" :fetch-suggestions="querySearch"
      placeholder="点击获取" @select="handleSelect" @click.native="sendindex(index)":disabled="!saveOrchange"></el-autocomplete>
							</td>
							<td>
							 <el-autocomplete class="inline-input"  v-model="item.storage_id" :fetch-suggestions="storagequerySearch"
      placeholder="点击获取" @select="storagehandleSelect"  @click.native="sendindex(index)" :disabled="!saveOrchange"></el-autocomplete>
							</td>
                            <td><input v-model="item.commodity_name" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.categoryName" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.brand" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.unitname" :disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.amount":disabled="!saveOrchange"></input></td>
                            <td><input v-model="item.price" :disabled="!saveOrchange"></input></td>
                            <td style="text-align:center">{{item.amountprice = item.amount*item.price}}</td>
                            <td><input v-model="item.chukudetail_remark" :disabled="!saveOrchange"></input></td>
                        </tr>
						</table>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addChuku()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeChuku()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')" v-if="saveOrchange">重置</el-button>
					<el-button @click="chukuDialogVisible=false"  v-else>取消</el-button>
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
				loading: false,
				saveOrchange:false,
				customerOptions:[],
				commodity:[],
				storage:[],
				options:[
					{
					value:'未出库',
					label:'未出库'
					},{
					value:'已出库',
					label:'已出库'
					}
				],
				dialogtitle:'',
				chuku: [
				],
                chukuDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    chuku_id:'',
                    chuku_date:'',
                    customer_id:'',
                    chuku_operator:'',
                    chuku_total:'',
                    chuku_state:'',
                    chuku_address:'',
                    chuku_remark:'',
					field0:''
                },
				commodityTable:[{
					commodity_id:'',
					storage_id:'',
					commodity_name:'',
					category_id:'',
					brand:'',
					unit_id:'',
					amount:'',
					price:'',
					amountprice:0,
					chukudetail_remark:'',
					stock_id:''
				}],
                rules: {
				chuku_id: [
					{ required: true, message: '请输入销售单号', trigger: 'blur' },
				],
                customer_id:[
					{ required: true, message: '请输入购买者', trigger: 'blur' },
                ]
                }
			}
		},
		methods: {
			createFilter(queryString) {
				return (string) => {
				return (string.value.indexOf(queryString.toLowerCase()) === 0);
				};
			},
			sendindex(index){
				this.index = index
			},
			storagehandleSelect(item){
				console.log(item)
				this.commodityTable[this.index].storage_id = item.value
				this.commodityTable[this.index].stock_id = item.stock_id
			},
			handleSelect(item) {
				console.log(item)
				this.getStorageFromStock(item.value)
				this.commodityTable[this.index].commodity_id = item.value
				this.commodityTable[this.index].commodity_name = item.commodity_name
				this.commodityTable[this.index].category_id = item.category_id
				this.commodityTable[this.index].brand = item.brand
				this.commodityTable[this.index].unit_id = item.unit_id
				this.commodityTable[this.index].categoryName = item.categoryName
				this.commodityTable[this.index].unitname = item.unitname
			},
			querySearch(queryString, cb) {
				var commodity = this.commodity;
				var results = queryString ? commodity.filter(this.createFilter(queryString)) : commodity;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			storagequerySearch(queryString, cb){
				var storage = this.storage;
				var results = queryString ? storage.filter(this.createFilter(queryString)) : storage;
				// 调用 callback 返回建议列表的数据
				cb(results);
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
				chukudetail_remark:'',
				stock_id:''
			})
		},
		newChuku(){
			var user = JSON.parse(sessionStorage.getItem('user'));
			this.chukuDialogVisible=true
			this.dialogtitle='增加销售单'
			this.saveOrchange=true
			this.ruleForm = {
                    chuku_id:'',
                    chuku_date:Date.parse(new Date()),
                    customer_id:'',
                    chuku_operator:user.username,
                    chuku_total:'',
                    chuku_state:'',
                    chuku_address:'',
                    chuku_remark:'',
					field0:'未出库'
                }
			this.commodityTable=[{
					commodity_id:'',
					storage_id:'',
					commodity_name:'',
					category_id:'',
					brand:'',
					unit_id:'',
					amount:'',
					price:'',
					amountprice:0,
					chukudetail_remark:'',
					stock_id:''
				}]
		},
		modifyChuku(){
			if(!this.currentRow){
				this.$message.error('请选择要审核的一列');
			} else{
				this.chukuDialogVisible=true
				this.dialogtitle='修改销售信息'
				this.saveOrchange = false
				this.ruleForm.chuku_id=this.currentRow.chuku_id
				this.ruleForm.chuku_date=this.currentRow.chuku_date
				this.ruleForm.customer_id=this.currentRow.customer_id
				this.ruleForm.chuku_operator=this.currentRow.chuku_operator
				this.ruleForm.chuku_total=this.currentRow.chuku_total
				this.ruleForm.chuku_state=this.currentRow.chuku_state
				this.ruleForm.chuku_address=this.currentRow.chuku_address
				this.ruleForm.chuku_remark=this.currentRow.chuku_remark
				this.ruleForm.field0=this.currentRow.field0
				this.getChukudetail(this.currentRow.chuku_id)
			}
		},
            handleCurrentChange(val) {
			this.currentRow = val;
			console.log(val)
		    },
			getChuku: function () {
                let url
                if(this.filters.name){
                    url = '/api/inventory/searchChuku?chuku_id='+ this.filters.name
                } else {
                    url = '/api/inventory/searchChuku'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.chuku = response.data.data
                        console.log(this.chuku)
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
            deleteChuku(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/inventory/deleteChuku?chuku_id=' + this.currentRow.chuku_id
					let url2 = '/api/inventory/deleteChukudetail?chuku_id=' + this.currentRow.chuku_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$http.get(url2).then(response => {
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getChuku()
							}, response => {
							console.log('error deleterukudetail!!');
							return false;
						});
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getChuku()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deleteChuku!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addChuku(){
               	let url = '/api/inventory/addChuku'
				let url2 = '/api/inventory/addChukudetail'
				var user = JSON.parse(sessionStorage.getItem('user'));
				var date = new Date(this.ruleForm.chuku_date).Format("yyyy-MM-dd")
				var header= {'content-type': 'application/x-www-form-urlencoded'}
				let parameter =	'chuku_id=' + this.ruleForm.chuku_id +
					'&customer_id=' + this.ruleForm.customer_id +
					'&chuku_operator='+ this.ruleForm.chuku_operator +
					'&chuku_total=' + this.ruleForm.chuku_total +
					'&chuku_address=' + this.ruleForm.chuku_address+
					'&chuku_date=' + date +
					'&chuku_remark='+this.ruleForm.chuku_remark+
					'&field0='+this.ruleForm.field0
				var parameter2
				console.log(this.commodityTable)
				this.$http.post(url,parameter,{headers:header}).then(response => {
					if(response.data.errorcode === '200'){
						for(var index in this.commodityTable){
							parameter2 = 'chuku_id=' + this.ruleForm.chuku_id + 
							'&commodity_id=' + this.commodityTable[index].commodity_id +
							'&storage_id=' + this.commodityTable[index].storage_id +
							'&amount=' + this.commodityTable[index].amount +
							'&price=' + this.commodityTable[index].price +
							'&amountprice=' + this.commodityTable[index].amountprice +
							'&chukudetail_remark=' + this.commodityTable[index].chukudetail_remark
							this.$http.post(url2,parameter2,{headers:header}).then(response => {
							}, response => {
								console.log('error submit!!');
								return false;
							});
							this.changeStock(this.ruleForm.field0,this.commodityTable[index].amount,this.commodityTable[index].stock_id)
					}
					this.chukuDialogVisible = false
					this.getChuku()
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
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
		changeChuku(){
			let url = '/api/inventory/modifyChuku'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'chuku_id=' + this.ruleForm.chuku_id +
				'&field0=' + this.ruleForm.field0 +
				'&chuku_remark='+ this.ruleForm.chuku_remark
			for(var index in this.commodityTable){
				this.changeStock(this.ruleForm.field0,this.commodityTable[index].amount,this.commodityTable[index].stock_id)
			}
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.chukuDialogVisible = false
					this.getChuku()
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
			getChukudetail(chuku){
				let url = '/api/inventory/searchChukudetail?chuku_id=' + chuku
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
								brand:resp[item].brand,
								categoryName:resp[item].categoryName,
								unit_id:resp[item].unit_id,
								unitname:resp[item].unitname})
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
			getCustomer: function () {
                let url = '/api/management/searchCustomer'
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.customerOptions = response.data.data
                        console.log(this.customerOptions)
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
			getStorage(){
			let url = '/api/management/searchStorage'
			this.$http.get(url).then(response => {
				console.log(response)
				if(response.data.errorcode === '200'){
					var resp = response.data.data
						for(var item in resp){
							this.storage.push({
								value: resp[item].storage_id
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
				if(state === '已出库'){
					let url = '/api/inventory/changeStockChukuamount?id='+ stockId +'&chukuamount='+ amount
					this.$http.get(url).then(response => {
					}, response => {
						console.log('error submit!!');
						return false;
					});
				}
			}
		},
		mounted(){
			this.getCommodity()
			this.getCustomer()
			this.getChuku()
		}

	};

</script>

<style scoped>

</style>