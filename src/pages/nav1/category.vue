<template>
	<section>
		<div class="menu">
		<el-input  placeholder="输入关键字进行过滤"  v-model="filterText" style="width:500px"></el-input>
      <el-button type="success" @click="categoryDialogVisible=true">新增</el-button>
      <el-button type="danger"@click.native="">修改</el-button>
      <el-button type="warning"@click.native="deleteCategory">删除</el-button>
    </div>
	<el-tree :data="data2" :props="defaultProps" show-checkbox node-key="id" default-expand-all
	:highlight-current="true" :filter-node-method="filterNode" ref="tree">
	</el-tree>

<el-dialog title="增加商品种类" v-model="categoryDialogVisible" size="tiny">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
					<el-form-item label="种类名称" prop="categoryname">
						<el-input v-model="ruleForm.categoryname"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addCategory()">增加</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</div>
		</el-dialog>
	</section>
</template>

<script>
 let id = 1000;

export default {
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		}
	},
	data() {
		return {
			filterText: '',
			categoryDialogVisible:false,
			ruleForm:{
				categoryname:''
			},
			rules: {
				categoryname: [
					{ required: true, message: '请输入种类名称', trigger: 'blur' },
				]
			},
			data2: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		}
	},
	methods: {
		getCategory(){
			var array = new Array()
			var a ,b
			let url = '/api/management/searchCategory'
			this.$http.get(url).then(response => {
				console.log(response.data.data)
				var result = response.data.data
				for(a in result){
					if(result[a].frontCategory==0){
						var node ={
							id: result[a].id,
							label: result[a].categoryName,
							children: []
						}
						array.push(node)
					} else{
						for(b in array){
							if(array[b].id == result[a].frontCategory){
								var node ={
									id: result[a].id,
									label: result[a].categoryName,
									children: []
								}
								array[b].children.push(node)
							}
						}
					}
				this.data2 = array
				}
			}, response => {
					console.log('error getCategory!!');
					return false;
				});
		},
		addCategory(){
			let url
			var array = this.$refs.tree.getCheckedNodes()
			var a = array.length - 1
			console.log(array[a])
			if(array[a]){
			 url = '/api/management/addCategory?category=' + this.ruleForm.categoryname + '&frontCategory=' + array[a].id
			} else{
			 url = '/api/management/addCategory?category=' + this.ruleForm.categoryname + '&frontCategory=0'
			}
			this.$http.get(url).then(response => {
				console.log(response.data)
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
					});
				this.categoryDialogVisible = false
				this.getCategory()
				} else {
					this.$message({
						message: response.data.errormsg,
						type: 'warning'
					});
				}
			}, response => {
					console.log('error addCategory!!');
					return false;
				});
		},
		deleteCategory(){
			let array = this.$refs.tree.getCheckedNodes()
			console.log(array)
			if(array.length === 0){
				this.$message.error('请选择要删除的类别');
			} else{
				for(a in array){
					let url = '/api/management/deleteCategory?categoryId=' + array[a].id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getCategory()
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
			}
		},
		append(store, data) {
			store.append({ id: id++, label: 'testtest', children: [] }, data);
		},
		remove(store, data) {
			store.remove(data);
		},
		filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
	},
	mounted() {
		this.getCategory()
	}
};
</script>

<style scoped>
.menu{
	margin-top:20px;
}
</style>