<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search"  v-on:click="getStock">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newStock">新增</el-button>
                    <el-button type="danger"@click.native="modifyStock()">修改库存</el-button>
                    <el-button type="warning"@click.native="deleteStock">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="stock" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange">
				<el-table-column prop="commodity_id" label="商品编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="commodity_name" label="商品名称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="storage_id" label="仓库编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="amount" label="库存量" width="120" sortable>
				</el-table-column>
				<el-table-column prop="rukuamount" label="入库" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chukuamount" label="出库" width="120" sortable>
				</el-table-column>
				<el-table-column prop="supplier_name" label="供应商" width="100"  sortable>
				</el-table-column>
				<el-table-column prop="supplier_linkman" label="联系人" width="120" sortable>
				</el-table-column>
				<el-table-column prop="supplier_phone" label="电话" width="120" sortable>
				</el-table-column>
				<el-table-column prop="stock_remark" label="备注" min-width="180" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog :title="dialogtitle" v-model="stockDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
				<el-row>
					<el-col :span="11"><el-form-item label="商品编号" prop="commodity_id">
						<el-autocomplete class="inline-input" v-model="ruleForm.commodity_id" :fetch-suggestions="querySearch" placeholder="点击获取" @select="handleSelect" :disabled="!saveOrchange">
						</el-autocomplete>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="商品名称" prop="commodity_name">
						<el-input v-model="ruleForm.commodity_name" :disabled="true" placeholder="点击商品编号可获取"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="库存量" prop="amount">
						<el-input v-model="ruleForm.amount" :disabled="true" placeholder="点击商品编号可获取">{{ruleForm.amount=ruleForm.rukuamount-ruleForm.chukuamount}}</el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="电话" prop="supplier_phone">
						<el-input v-model="ruleForm.supplier_phone" :disabled="true" placeholder="点击商品编号可获取"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="供应商" prop="supplier_name">
						<el-input v-model="ruleForm.supplier_name" :disabled="true" placeholder="点击商品编号可获取"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="供应商联系人" prop="supplier_linkman">
						<el-input v-model="ruleForm.supplier_linkman" :disabled="true" placeholder="点击商品编号可获取"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="入库" prop="rukuamount">
						<el-input v-model="ruleForm.rukuamount"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="出库" prop="chukuamount">
						<el-input v-model="ruleForm.chukuamount"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
				<el-col :span="12"><el-form-item label="仓库编号" prop="storage_id">
						<el-autocomplete class="inline-input"  v-model="ruleForm.storage_id" :fetch-suggestions="storagequerySearch" placeholder="点击获取"  @select="storagehandleSelect" :disabled="!saveOrchange">
						</el-autocomplete>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="23">
						<el-form-item label="备注" prop="stock_remark">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.stock_remark"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addStock()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeStock()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
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
				dialogtitle:'',
				stock: [],
				commodity:[],
				storage:[],
				supplier:[],
                stockDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    commodity_id:'',
                    commodity_name:'',
                    storage_id:'',
                    amount:'',
                    rukuamount:'',
                    chukuamount:'',
                    supplier_name:'',
                    supplier_linkman:'',
                    supplier_phone:'',
					stock_remark:''
                },
                rules: {
				commodity_id: [
					{ required: true, message: '请输入商品编号', trigger: 'blur' },
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
			handleSelect(item) {
				this.ruleForm.commodity_id = item.value
				this.ruleForm.commodity_name = item.commodity_name
				this.ruleForm.amount = item.amount
				this.getSupplier(item.supplier_id)
			},
			querySearch(queryString, cb) {
				var commodity = this.commodity;
				var results = queryString ? commodity.filter(this.createFilter(queryString)) : commodity;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			storagehandleSelect(item) {
				this.ruleForm.storage_id = item.value
			},
			storagequerySearch(queryString, cb) {
				var storage = this.storage;
				var results = queryString ? storage.filter(this.createFilter(queryString)) : storage;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
		newStock(){
			this.stockDialogVisible=true
			this.dialogtitle='添加库存信息'
			this.saveOrchange=true
			this.ruleForm = {
                    commodity_id:'',
                    commodity_name:'',
                    storage_id:'',
                    amount:'',
                    rukuamount:'',
                    chukuamount:'',
                    supplier:'',
                    supplier_linkman:'',
                    supplier_phone:'',
					stock_remark:''
                }
		},
            handleCurrentChange(val) {
			this.currentRow = val;
			console.log(val)
		    },
			getStock: function () {
                let url
                if(this.filters.name){
                    url = '/api/inventory/searchStock?commodity_id='+ this.filters.name
                } else {
                    url = '/api/inventory/searchStock'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                        console.log(response)
                    if(response.data.errorcode === '200'){
                        this.stock = response.data.data
                        console.log(this.stock)
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
            deleteStock(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/inventory/deleteStock?id=' + this.currentRow.id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getStock()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deletestock!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addStock(){
                let url = '/api/inventory/addStock'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = Date.parse(new Date());
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'commodity_id=' + this.ruleForm.commodity_id +
				'&storage_id='+ this.ruleForm.storage_id+
				'&rukuamount=' + this.ruleForm.rukuamount+
				'&chukuamount='+this.ruleForm.chukuamount+
				'&stock_remark='+ this.ruleForm.stock_remark
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.stockDialogVisible = false
					this.getStock()
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
			modifyStock(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.stockDialogVisible=true
				this.dialogtitle='修改库存信息'
				this.saveOrchange = false
				this.ruleForm = {
                    commodity_id:this.currentRow.commodity_id,
                    commodity_name:this.currentRow.commodity_name,
                    storage_id:this.currentRow.storage_id,
                    amount:this.currentRow.amount,
                    rukuamount:this.currentRow.rukuamount,
                    chukuamount:this.currentRow.chukuamount,
                    supplier_name:this.currentRow.supplier_name,
                    supplier_linkman:this.currentRow.supplier_linkman,
                    supplier_phone:this.currentRow.supplier_phone,
                    stock_remark:this.currentRow.stock_remark,
                }
			}
		},
		changeStock(){
			let url = '/api/inventory/modifyStock'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	 'id=' + this.currentRow.id +
				'&commodity_id=' + this.ruleForm.commodity_id +
				'&rukuamount=' + this.ruleForm.rukuamount +
				'&chukuamount='+ this.ruleForm.chukuamount+
				'&stock_remark='+ this.ruleForm.stock_remark
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
						this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
					this.stockDialogVisible = false
					this.getStock()
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
		getCommodity: function () {
        let url = '/api/management/searchCommodities'
          this.$http.get(url).then(response => {
              if(response.data.errorcode === '200'){
                  var resp = response.data.data
					for(var item in resp){
						this.commodity.push({
							value: resp[item].commodity_id,
							commodity_name:resp[item].commodity_name,
							amount:resp[item].amount,
							supplier_id:resp[item].supplier_id,
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
			getStorage(){
			let url = '/api/management/searchStorage'
			this.$http.get(url).then(response => {
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
		getSupplier: function (supplierId) {
                let url = '/api/management/searchSupplier?supplier_id=' + supplierId
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.supplier = response.data.data
						this.ruleForm.supplier_name = this.supplier[0].supplier_name
						this.ruleForm.supplier_linkman = this.supplier[0].supplier_linkman
						this.ruleForm.supplier_phone = this.supplier[0].supplier_phone
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
		mounted(){
			this.getCommodity()
			this.getStorage()
			this.getStock()
		}
	};

</script>

<style scoped>

</style>