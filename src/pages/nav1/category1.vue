<template>
	<section>
	<!--工具条-->
			<el-form :inline="true" :model="filters" style="margin:10px 0px -15px 0px;">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品类别"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCategoryByName()">查询</el-button>
				</el-form-item>
              <el-button type="success" @click="categoryDialogVisible=true">新增</el-button>
              <el-button type="danger"@click.native="deleteCategory">删除</el-button>
			</el-form>

    <template>
        <el-tree :data="regions" :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange" :check-strictly="true">
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
      </template>
	</section>
</template>

<script>
  export default {
    data() {
      return {
        filters:{name:''},
        categoryDialogVisible:false,
        regions: [],
        ruleForm:{
          categoryname:''
        },
        rules: {
				categoryname: [
					{ required: true, message: '请输入种类名称', trigger: 'blur' }
          ]
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        currentNodeId:''
      };
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        this.currentNodeId = data.id
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve(this.regions);
        } else{
        var id = node.data.id
        let url = '/api/management/searchFrontCategory?frontCategory=' +id
			  this.$http.get(url).then(response => {
          var resp = response.data.data
          if(resp.length>0){
            var data = new Array()
            for(var i in resp){
              data.push({
                'name':resp[i].categoryName,
                'id':resp[i].id
                })
            }
          } else{
            data=[]
          }
            resolve(data);
          }, response => {
					console.log('error getCategory');
					return false;
				});
        }
      },
      getCategory(id){
			let url = '/api/management/searchFrontCategory?frontCategory=' +id
			this.$http.get(url).then(response => {
				var result = response.data.data
        this.regions=[]
        for(var i in result){
          this.regions.push({
            'name':result[i].categoryName,
            'id':result[i].id
          })

        }
			}, response => {
					console.log('error');
					return false;
				});
		},
    getCategoryByName(){
      let url = '/api/management/searchCategoryByName?categoryName=' +this.filters.name
			this.$http.get(url).then(response => {
        var result = response.data.data
        this.regions=[]
        for(var i in result){
          this.regions.push({
            'name':result[i].categoryName,
            'id':result[i].id
          })
        }
      }, response => {
        console.log('error');
        return false;
      });
    },
    deleteCategory(){
      console.log(this.currentNodeId)
			if(!this.currentNodeId){
				this.$message.error('请选择要删除的类别');
			} else{
					let url = '/api/management/deleteCategory?categoryId=' + this.currentNodeId
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getCategory(0)
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
    addCategory(){
      let url
			if(this.currentNodeId){
			 url = '/api/management/addCategory?category=' + this.ruleForm.categoryname + '&frontCategory=' + this.currentNodeId
			} else{
			 url = '/api/management/addCategory?category=' + this.ruleForm.categoryname + '&frontCategory= 0'
			}
			this.$http.get(url).then(response => {
				console.log(response.data)
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
					});
				this.categoryDialogVisible = false
        

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
		}
    },
    mounted(){
        this.getCategory(0)
    }
  }
</script>

<style scoped>

</style>