<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="客户编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCustomer">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newCustomer">新增</el-button>
                    <el-button type="danger"@click.native="modifyCustomer()">修改</el-button>
                    <el-button type="warning"@click.native="deleteCustomer">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange">
				<el-table-column prop="customer_id" label="客户编号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="chargePeople" label="联系人" width="120" sortable>
				</el-table-column>
				<el-table-column prop="company" label="公司" width="100"  sortable>
				</el-table-column>
				<el-table-column prop="customer_telephone" label="电话" width="120" sortable>
				</el-table-column>
				<el-table-column prop="customer_phone" label="移动电话" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="customer_address" label="住址" width="180" sortable>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="180" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog title="增加客户" v-model="customerDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
				<el-row>
					<el-col :span="11"><el-form-item label="客户编号" prop="customer_id">
						<el-input v-model="ruleForm.customer_id" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="联系人" prop="chargePeople">
						<el-input v-model="ruleForm.chargePeople" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="公司" prop="company">
						<el-input v-model="ruleForm.company"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="地址" prop="customer_address">
						<el-input v-model="ruleForm.customer_address"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="电话" prop="customer_telephone">
						<el-input v-model="ruleForm.customer_telephone"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="移动电话" prop="customer_phone">
						<el-input v-model="ruleForm.customer_phone"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="23">
						<el-form-item label="备注" prop="remark">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.remark"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addCustomer()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeCustomer()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')" v-if="saveOrchange">重置</el-button>
					<el-button @click="customerDialogVisible=false" v-else>取消</el-button>
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
				users: [
				],
                customerDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    customer_id:'',
                    chargePeople:'',
                    company:'',
                    customer_address:'',
                    customer_telephone:'',
                    customer_phone:'',
                    remark:'',
                },
                rules: {
				customer_id: [
					{ required: true, message: '请输入客户编号', trigger: 'blur' },
				]}
			}
		},
		methods: {
		newCustomer(){
			this.customerDialogVisible=true
			this.dialogtitle='增加客户信息'
			this.saveOrchange=true
			this.ruleForm = {
                    customer_id:'',
                    chargePeople:'',
                    company:'',
                    customer_address:'',
                    customer_telephone:'',
                    customer_phone:'',
                    remark:'',
                }
		},
            handleCurrentChange(val) {
			this.currentRow = val;
			console.log(val)
		    },
			//获取客户列表
			getCustomer: function () {
                let url
                if(this.filters.name){
                    url = '/api/management/searchCustomer?customer_id='+ this.filters.name
                } else {
                    url = '/api/management/searchCustomer'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.users = response.data.data
                        console.log(this.users)
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
            deleteCustomer: function(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/management/deleteCustomer?customer_id=' + this.currentRow.customer_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getCustomer()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deleteCustomer!!');
							return false;
						});
			}
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addCustomer(){
                let url = '/api/management/addCustomer'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = Date.parse(new Date());
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'customer_id=' + this.ruleForm.customer_id +
				'&chargePeople=' + this.ruleForm.chargePeople +
				'&company='+ this.ruleForm.company+
				'&customer_address=' + this.ruleForm.customer_address +
				'&customer_telephone=' + this.ruleForm.customer_telephone+
				'&customer_phone='+this.ruleForm.customer_phone+
				'&remark='+ this.ruleForm.remark+
				'&createPeopleId='+ user.id
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.customerDialogVisible = false
					this.getCustomer()
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
            modifyCustomer(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.customerDialogVisible=true
				this.dialogtitle='修改仓库信息'
				this.saveOrchange = false
				this.ruleForm = this.currentRow
                this.ruleForm = {
                    customer_id:this.currentRow.customer_id,
                    chargePeople:this.currentRow.chargePeople,
                    company:this.currentRow.company,
                    customer_address:this.currentRow.customer_address,
                    customer_telephone:this.currentRow.customer_telephone,
                    customer_phone:this.currentRow.customer_phone,
                    remark:this.currentRow.remark,
                }
			}
		},
		changeCustomer(){
			let url = '/api/management/modifyCustomer'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'customer_id=' + this.ruleForm.customer_id +
				'&chargePeople=' + this.ruleForm.chargePeople +
				'&company='+ this.ruleForm.company+
				'&customer_address=' + this.ruleForm.customer_address +
				'&customer_telephone=' + this.ruleForm.customer_telephone+
				'&customer_phone='+this.ruleForm.customer_phone+
				'&remark='+ this.ruleForm.remark
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.customerDialogVisible = false
					this.getCustomer()
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
		mounted() {
			this.getCustomer();
		}
	};

</script>

<style scoped>

</style>