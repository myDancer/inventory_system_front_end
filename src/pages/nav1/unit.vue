<template>
  <section>
    <div class="menu">
			<el-input v-model="searchInput" placeholder="请输入内容" style="width:180px"></el-input>
      <el-button type="primary" icon="search" @click.native="searchUnit">查询</el-button>
      <el-button type="success" @click="unitDialogVisible=true,saveOrchange=true">新增</el-button>
      <el-button type="danger"@click.native="modifyUnit">修改</el-button>
      <el-button type="warning"@click.native="deleteUnit">删除</el-button>
    </div>
		  <el-table :data="tableData" border  style="width: 60%"highlight-current-row @current-change="handleCurrentChange">
				<el-table-column prop="id"  label="单位序号" width="100">
				</el-table-column>
				<el-table-column prop="unitname" label="单位名称" width="100">
				</el-table-column>
				<el-table-column prop="introduction" label="单位说明">
				</el-table-column>
			</el-table>
			<el-dialog title="增加计量单位" v-model="unitDialogVisible" size="tiny">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
					<el-form-item label="单位名称" prop="unitname">
						<el-input v-model="ruleForm.unitname" :disabled="!saveOrchange"></el-input>
					</el-form-item>
					<el-form-item label="说明" prop="introduction">
						<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.introduction"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addUnit()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeUnit()" v-else>保存</el-button>
					<el-button @click="resetForm('ruleForm')" v-if="saveOrchange">重置</el-button>
					<el-button @click="unitDialogVisible=false" v-else>取消</el-button>
				</div>
		</el-dialog>
  </section>
</template>
<script>
export default {
	data() {
		return{
			searchInput:'',
			saveOrchange:false,
			tableData:[],
			currentRow:'',
			dialogtitle:'',
			unitDialogVisible:false,
			ruleForm:{
				unitname:'',
				introduction:''
			},
			rules: {
          unitname: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
          ]
        },
		}
	},
	methods: {
		searchUnit(){
			let url = '/api/management/searchUnits?id=' + this.searchInput
			this.$http.get(url).then(response => {
				this.tableData = response.data.data
			}, response => {
					console.log('error submit!!');
					return false;
				});
		},
		addUnit(){
			let url = '/api/management/addUnits?units=' + this.ruleForm.unitname + '&introduction=' + this.ruleForm.introduction
			this.$http.get(url).then(response => {
				console.log(response)
				if(response.data.errorcode === '200'){
					this.searchUnit()
					this.$message({
						message: response.data.errormsg,
						type: 'success'
					});
				this.unitDialogVisible = false
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
		deleteUnit(){
			if(this.currentRow){
				let url = '/api/management/deleteUnitsById?unitId=' + this.currentRow.id
				this.$http.get(url).then(response => {
					if(response.data.errorcode === '200'){
						this.$message({
							message: response.data.errormsg,
							type: 'success'
						});
						this.searchUnit()
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
			} else {
				this.$message.error('请选择计量单位！');
			}
		},
		 handleCurrentChange(val) {
        	this.currentRow = val;
      },
		resetForm(formName) {
        this.$refs[formName].resetFields();
      },
	  modifyUnit(){
		  if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.unitDialogVisible=true
				this.dialogtitle='修改单位信息'
				this.saveOrchange = false
				this.ruleForm = {
					unitname:this.currentRow.unitname,
					introduction:this.currentRow.introduction
                }
			}
	  },
	  changeUnit(){
		  let url = '/api/management/modifyUnits'
		  var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'id=' + this.currentRow.id +
				'&unitname=' + this.ruleForm.unitname +
				'&introduction=' + this.ruleForm.introduction
				console.log(parameter)
				this.$http.post(url,parameter,{headers:header}).then(response => {
					if(response.data.errorcode === '200'){
						this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.unitDialogVisible = false
					this.searchUnit()
					}
						}, response => {
						console.log('error submit!!');
						return false;
					});
	  }
	},
	mounted(){
		this.searchUnit()
	}
}
</script>
<style scoped>
.menu{
	margin:10px 0px;
}
</style>