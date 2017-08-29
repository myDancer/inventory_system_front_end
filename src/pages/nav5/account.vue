<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker v-model="filters.date" type="month" placeholder="选择月份查询"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAccount">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newAccount">新增</el-button>
                    <el-button type="danger"@click.native="modifyAccount()">修改</el-button>
                    <el-button type="warning"@click.native="deleteAccount">删除</el-button>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="account" highlight-current-row v-loading="loading" style="width: 100%;"@current-change="handleCurrentChange">
				<el-table-column prop="account_date" label="月份" width="120" sortable>
				</el-table-column>
				<el-table-column prop="account_in" label="收入" width="120" sortable>
				</el-table-column>
				<el-table-column prop="account_out" label="支出" width="120"  sortable>
				</el-table-column>
				<el-table-column prop="account_profit" label="利润" width="120" sortable>
				</el-table-column>
				<el-table-column prop="account_remark" label="备注" min-width="180" sortable>
				</el-table-column>
			</el-table>

            	<el-dialog :title="dialogtitle" v-model="accountDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px">
				<el-row>
					<el-col :span="6"><el-form-item label="月份" prop="account_date">
						<el-date-picker v-model="ruleForm.account_date" type="month" placeholder="选择月" :disabled="!saveOrchange">
						</el-date-picker>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="6"><el-form-item label="收入" prop="account_in">
						<el-input v-model="ruleForm.account_in"><template slot="append">￥</template></el-input>
					</el-form-item></el-col>
					<el-col :span="6"><el-form-item label="支出" prop="account_out">
						<el-input v-model="ruleForm.account_out" ><template slot="append">￥</template></el-input>
					</el-form-item></el-col>
					<el-col :span="6"><el-form-item label="利润" prop="account_profit">
						<el-input v-model="ruleForm.account_profit" :disabled="true">{{ruleForm.account_profit =ruleForm.account_in-ruleForm.account_out}}<template slot="append">￥</template></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="20">
						<el-form-item label="备注" prop="account_remark">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.account_remark"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addAccount()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeAccount()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')"  v-if="saveOrchange">重置</el-button>
					<el-button @click="accountDialogVisible=false" v-else>取消</el-button>
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
				filters:{
					date:''
				},
				textvalue:'',
				loading: false,
				saveOrchange:false,
				dialogtitle:'',
				account: [
				],
                accountDialogVisible:false,
                currentRow: null,
                ruleForm:{
                    account_date:'',
                    account_in:'',
                    account_out:'',
                    account_profit:0,
                    account_remark:''
                },
                rules: {
				account_date: [
					{ required: true, message: '选择月份', trigger: 'blur' },
				], 
				account_in:[
					{ required: true, message: '请填写金额', trigger: 'blur' },
				]}
			}
		},
		methods: {
		newAccount(){
			this.accountDialogVisible=true
			this.dialogtitle='增加月账单'
			this.saveOrchange=true
			this.ruleForm = {
                    account_date:'',
                    account_in:'',
                    account_out:'',
                    account_profit:0,
                    account_remark:''
                }
		},
            handleCurrentChange(val) {
			this.currentRow = val;
		    },
			getAccount: function () {
                let url
                if(this.filters.name){
                    url = '/api/inventory/searchAccount?account_date='+ this.filters.name
                } else {
                    url = '/api/inventory/searchAccount'
                }
				this.loading = true;
				NProgress.start();
                this.$http.get(url).then(response => {
                    if(response.data.errorcode === '200'){
                        this.account = response.data.data
                        console.log(this.account)
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
            deleteAccount(){
                if(!this.currentRow){
                    this.$message.error('请选择要删除的一列');
                } else{
					let url = '/api/management/deleteaccount?account_id=' + this.currentRow.account_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getAccount()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deleteaccount!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
            addAccount(){
                let url = '/api/inventory/addAccount'
			var time = new Date(this.ruleForm.account_date).Format("yyyy-MM")
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'account_date=' + time +
				'&account_in=' + this.ruleForm.account_in +
				'&account_out='+ this.ruleForm.account_out+
				'&account_profit=' + this.ruleForm.account_profit +
				'&account_remark=' + this.ruleForm.account_remark
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.accountDialogVisible = false
					this.getAccount()
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
			modifyAccount(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.accountDialogVisible=true
				this.dialogtitle='修改供应商信息'
				this.saveOrchange = false
				this.ruleForm.account_date=this.currentRow.account_date
				this.ruleForm.account_in=this.currentRow.account_in
				this.ruleForm.account_out=this.currentRow.account_out
				this.ruleForm.account_profit=this.currentRow.account_profit
				this.ruleForm.account_remark=this.currentRow.account_remark===null?'':this.currentRow.account_remark
			}
		},
		changeAccount(){
			let url = '/api/inventory/modifyAccount'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'id=' + this.currentRow.id +
				'&account_in=' + this.ruleForm.account_in +
				'&account_out='+ this.ruleForm.account_out+
				'&account_profit=' + this.ruleForm.account_profit +
				'&account_remark='+ this.ruleForm.account_remark
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.accountDialogVisible = false
					this.getAccount()
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
			this.getAccount()
		}
	};

</script>

<style scoped>

</style>