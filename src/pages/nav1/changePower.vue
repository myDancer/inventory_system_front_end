<template>
	<section>
		<div style="margin: 15px 10px;">
			<el-row>
				<el-col :span="9">
				<el-input placeholder="查找用户" v-model="filter">
					<el-button slot="append" icon="search" @click.native="filterUser()">查寻</el-button>
				</el-input>
				</el-col>
			</el-row>
		</div>
		<div v-for="(user,index) in users">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="用户名">
					<el-input v-model="user.username" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="权限设置">
					<el-select v-model="user.power" placeholder="请选择权限">
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item><el-form-item>
					<el-button type="primary" @click="onSubmit(users[index])">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</section>
</template>

<script>
export default {
	data(){
		return{
			filter:'',
			users:[],
			filterusers:[],
			backups:[],
			options:[{
          		label: '系统管理员',
				value: 0,
			},{
          		label: '采购人员',
				value: 1,
			},{
          		label: '销售人员',
				value: 2,
			},{
          		label: '仓库人员',
				value: 3,
			},{
          		label: '财务人员',
				value: 4,
			}]
		}
	},
	methods:{
		onSubmit(user) {
			console.log(user);
			let url = '/api/management/changePower?id=' + user.id + '&power=' + user.power
			this.$http.get(url).then(response => {
				if(response.data.errorcode === '200'){
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
					console.log('error !!');
					return false;
				});
		},
		searchUser(){
			let url = '/api/management/searchUser'
			this.$http.get(url).then(response => {
				if(response.data.errorcode === '200'){
					this.users = response.data.data
					this.backups = response.data.data
				} else {
					this.$message({
						message: response.data.errormsg,
						type: 'warning'
					});
				}
			}, response => {
					console.log('error !!');
					return false;
				});
		},
		filterUser(){
			if(this.filter !== ''){
				for(var i in this.users){
					if(this.filter == this.users[i].username){
						this.filterusers.push(this.users[i])
					}
				}
				this.users = this.filterusers
			} else{
				this.users = this.backups
			}
		}
	},
	mounted(){
		this.searchUser()
	}
}
</script>

<style scoped>

</style>