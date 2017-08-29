<template>
	<section>
		<div class="menu">
			<el-input v-model="searchInput" placeholder="请输入仓库编号" style="width:180px"></el-input>
      <el-button type="primary" icon="search" @click.native="getStorage">查询</el-button>
      <el-button type="success" @click="newStorage()">新增</el-button>
      <el-button type="danger"@click.native="modifyStorage()">修改</el-button>
      <el-button type="warning"@click.native="deleteStorage">删除</el-button>
    </div>
		  <el-table
    :data="tableData"
		border
    highlight-current-row
    @current-change="handleCurrentChange"
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="storage_id"
      label="仓库编号"
      width="120">
    </el-table-column>
    <el-table-column
      property="storage_serialNumber"
      label="序列号"
      width="120">
    </el-table-column>
    <el-table-column
      property="imeiNumber"
      label="IMEI号">
    </el-table-column>
    <el-table-column
      property="field0"
      label="城市">
    </el-table-column>
    <el-table-column
      property="address"
      label="地址">
    </el-table-column>
    <el-table-column
      property="goodShelves"
      label="货架">
    </el-table-column>
    <el-table-column
      property="storage_position"
      label="仓位">
    </el-table-column>
    <el-table-column
      property="remark"
      label="备注">
    </el-table-column>
  </el-table>
	<el-dialog :title="dialogtitle" v-model="storageDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
				<el-row>
					<el-col :span="12"><el-form-item label="仓库编号" prop="storage_id">
						<el-input v-model="ruleForm.storage_id" :disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="序列号" prop="storage_serialNumber">
						<el-input v-model="ruleForm.storage_serialNumber"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="IMEI号" prop="imeiNumber">
						<el-input v-model="ruleForm.imeiNumber"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="城市" prop="address">
						<el-input v-model="ruleForm.field0"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="地址" prop="address">
						<el-input v-model="ruleForm.address"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="货架" prop="goodShelves">
						<el-input v-model="ruleForm.goodShelves"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="仓位" prop="storage_position">
						<el-input v-model="ruleForm.storage_position"></el-input>
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
					<el-button type="primary" @click.native="addStorage()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeStorage()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</div>
		</el-dialog>
	</section>
</template>

<script>
export default {
 	data() {
      return {
        tableData: [],
        currentRow: null,
				saveOrchange:false,
				storageDialogVisible:false,
				searchInput:'',
				dialogtitle:'',
				ruleForm:{
					storage_id:'',
					storage_serialNumber:'',
					imeiNumber:'',
					field0:'',
					address:'',
					goodShelves:'',
					storage_position:'',
					remark:'',
				},
				rules: {
				storage_id: [
					{ required: true, message: '请输入仓库编号', trigger: 'blur' },
				]}
      }
	},
	methods: {
		newStorage(){
			this.storageDialogVisible=true
			this.dialogtitle='增加仓库信息'
			this.saveOrchange=true
			this.ruleForm = {
					storage_id:'',
					storage_serialNumber:'',
					imeiNumber:'',
					address:'',
					field0:'',
					goodShelves:'',
					storage_position:'',
					remark:'',
				}
		},
		handleCurrentChange(val) {
			this.currentRow = val;
			console.log(val)
		},
		getStorage(){
			let url
			console.log(this.searchInput)
			if(this.searchInput){
			 	url = '/api/management/searchStorage?storage_id=' + this.searchInput
			} else {
				url = '/api/management/searchStorage'
			}
		this.$http.get(url).then(response => {
			console.log(response)
			if(response.data.errorcode === '200'){
				this.tableData = response.data.data
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
		deleteStorage(){
			if(!this.currentRow){
				this.$message.error('请选择要删除的一列');
			} else{
					let url = '/api/management/deleteStorage?storage_id=' + this.currentRow.storage_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getStorage()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error getCategory!!');
							return false;
						});
			}
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		addStorage(){
			let url = '/api/management/addStorage'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = Date.parse(new Date());
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'storage_id=' + this.ruleForm.storage_id +
				'&storage_serialNumber=' + this.ruleForm.storage_serialNumber +
				'&imeiNumber='+ this.ruleForm.imeiNumber+
				'&field0='+ this.ruleForm.field0+
				'&address=' + this.ruleForm.address +
				'&goodShelves=' + this.ruleForm.goodShelves+
				'&storage_position='+this.ruleForm.storage_position+
				'&remark='+ this.ruleForm.remark+
				'&createPeople='+ user.id
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.storageDialogVisible = false
					this.getStorage()
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
		modifyStorage(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.storageDialogVisible=true
				this.dialogtitle='修改仓库信息'
				this.saveOrchange = false
				this.ruleForm = {
					storage_id:this.currentRow.storage_id,
					storage_serialNumber:this.currentRow.storage_serialNumber===null?'':this.currentRow.storage_serialNumber,
					imeiNumber:this.currentRow.imeiNumber===null?'':this.currentRow.imeiNumber,
					field0:this.currentRow.field0===null?'':this.currentRow.field0,
					address:this.currentRow.address===null?'':this.currentRow.address,
					goodShelves:this.currentRow.goodShelves===null?'':this.currentRow.goodShelves,
					storage_position:this.currentRow.storage_position===null?'':this.currentRow.storage_position,
					remark:this.currentRow.remark===null?'':this.currentRow.remark,
				}
			}
		},
		changeStorage(){
			let url = '/api/management/modifyStorage'
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'storage_id=' + this.ruleForm.storage_id +
				'&storage_serialNumber=' + this.ruleForm.storage_serialNumber +
				'&imeiNumber='+ this.ruleForm.imeiNumber+
				'&field0='+ this.ruleForm.field0+
				'&address=' + this.ruleForm.address +
				'&goodShelves=' + this.ruleForm.goodShelves+
				'&storage_position='+this.ruleForm.storage_position+
				'&remark='+ this.ruleForm.remark
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.storageDialogVisible = false
					this.getStorage()
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
		this.getStorage()
	}
}

</script>

<style scoped>
.menu{
	margin:10px 0 3px 0;
}
</style>