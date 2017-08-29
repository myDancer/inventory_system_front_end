<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="供应商编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getSupplier">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newSupplier">新增</el-button>
                    <el-button type="danger"@click.native="modifySupplier()">修改</el-button>
                    <el-button type="warning"@click.native="deleteSupplier">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="supplier" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange">
				<el-table-column prop="supplier_id" label="供应商编号" width="180" sortable>
				</el-table-column>
				<el-table-column prop="supplier_linkman" label="联系人" width="120" sortable>
				</el-table-column>
				<el-table-column prop="supplier_name" label="供应商" width="100"  sortable>
				</el-table-column>
				<el-table-column prop="supplier_phone" label="电话" width="120" sortable>
				</el-table-column>
				<el-table-column prop="supplier_telephone" label="移动电话" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="supplier_city" label="城市" width="180" sortable>
				</el-table-column>
				<el-table-column prop="supplier_address" label="地址" width="180" sortable>
				</el-table-column>
				<el-table-column prop="supplier_remark" label="备注" min-width="180" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog title="增加供应商" v-model="supplierDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
				<el-row>
					<el-col :span="11"><el-form-item label="供应商编号" prop="supplier_id">
						<el-input v-model="ruleForm.supplier_id":disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="联系人" prop="supplier_linkman">
						<el-input v-model="ruleForm.supplier_linkman"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="供应商" prop="supplier_name">
						<el-input v-model="ruleForm.supplier_name" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="电话" prop="supplier_phone">
						<el-input v-model="ruleForm.supplier_phone"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="移动电话" prop="supplier_telephone">
						<el-input v-model="ruleForm.supplier_telephone"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="城市" prop="supplier_city">
						<el-input v-model="ruleForm.supplier_city"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="地址" prop="supplier_address">
						<el-input v-model="ruleForm.supplier_address"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="23">
						<el-form-item label="备注" prop="supplier_remark">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.supplier_remark"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addSupplier()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeSupplier()" v-else>保存</el-button>
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
				supplier: [
				],
                supplierDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    supplier_id:'',
                    supplier_linkman:'',
                    supplier_name:'',
                    supplier_phone:'',
                    supplier_telephone:'',
                    supplier_city:'',
                    supplier_address:'',
                    supplier_remark:'',
                },
                rules: {
				supplier_id: [
					{ required: true, message: '请输入供应商编号', trigger: 'blur' },
				],
                supplier_name:[
					{ required: true, message: '请输入供应商名称', trigger: 'blur' },
                ]
                }
			}
		},
		methods: {
		newSupplier(){
			this.supplierDialogVisible=true
			this.dialogtitle='增加供应商信息'
			this.saveOrchange=true
			this.ruleForm = {
                    supplier_id:'',
                    supplier_linkman:'',
                    supplier_name:'',
                    supplier_phone:'',
                    supplier_telephone:'',
                    supplier_city:'',
                    supplier_address:'',
                    supplier_remark:'',
                }
		},
            handleCurrentChange(val) {
			this.currentRow = val;
			console.log(val)
		    },
			getSupplier: function () {
                let url
                if(this.filters.name){
                    url = '/api/management/searchSupplier?supplier_id='+ this.filters.name
                } else {
                    url = '/api/management/searchSupplier'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.supplier = response.data.data
                        console.log(this.supplier)
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
            deleteSupplier(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/management/deleteSupplier?supplier_id=' + this.currentRow.supplier_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getSupplier()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deleteSupplier!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addSupplier(){
                let url = '/api/management/addSupplier'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = Date.parse(new Date());
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'supplier_id=' + this.ruleForm.supplier_id +
				'&supplier_linkman=' + this.ruleForm.supplier_linkman +
				'&supplier_name='+ this.ruleForm.supplier_name+
				'&supplier_phone=' + this.ruleForm.supplier_phone +
				'&supplier_telephone=' + this.ruleForm.supplier_telephone+
				'&supplier_city='+this.ruleForm.supplier_city+
				'&supplier_address='+this.ruleForm.supplier_address+
				'&supplier_remark='+ this.ruleForm.supplier_remark +
				'&createPeople='+ user.id
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.supplierDialogVisible = false
					this.getSupplier()
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
			modifySupplier(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.supplierDialogVisible=true
				this.dialogtitle='修改供应商信息'
				this.saveOrchange = false
				this.ruleForm = {
                    supplier_id:this.currentRow.supplier_id,
                    supplier_linkman:this.currentRow.supplier_linkman,
                    supplier_name:this.currentRow.supplier_name,
                    supplier_phone:this.currentRow.supplier_phone,
                    supplier_telephone:this.currentRow.supplier_telephone,
                    supplier_city:this.currentRow.supplier_city,
                    supplier_address:this.currentRow.supplier_address,
                    supplier_remark:this.currentRow.supplier_remark,
                }
			}
		},
		changeSupplier(){
			let url = '/api/management/modifySupplier'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'supplier_id=' + this.ruleForm.supplier_id +
				'&supplier_linkman=' + this.ruleForm.supplier_linkman +
				'&supplier_name='+ this.ruleForm.supplier_name+
				'&supplier_phone=' + this.ruleForm.supplier_phone +
				'&supplier_telephone=' + this.ruleForm.supplier_telephone+
				'&supplier_city='+this.ruleForm.supplier_city+
				'&supplier_address='+this.ruleForm.supplier_address+
				'&supplier_remark='+ this.ruleForm.supplier_remark
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.supplierDialogVisible = false
					this.getSupplier()
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
			changeNullToSpace(para){
				if(para == null){
					para = ''
				}
			}
		},
		mounted() {
			this.getSupplier();
		}
	};

</script>

<style scoped>

</style>