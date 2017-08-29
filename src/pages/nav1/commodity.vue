<template>
	<section>
  <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCommodity">查询</el-button>
				</el-form-item>
                <el-button type="success" @click="newCommodity">新增</el-button>
                    <el-button type="danger"@click.native="modifyCommodity()">修改</el-button>
                    <el-button type="warning"@click.native="deleteCommodity">删除</el-button>
			</el-form>
		</el-col>
    <template>
		  <el-table :data="commodity"	highlight-current-row	border style="width: 100%"	 @current-change="handleCurrentChange">
        <el-table-column type="index" width="40">
        </el-table-column>
        <el-table-column label="商品编号" prop="commodity_id"  width="120">
        </el-table-column>
        <el-table-column  label="商品名称"  prop="commodity_name" width="120">
        </el-table-column>
        <el-table-column  label="商品类型" prop="categoryName" width="120">
        </el-table-column>
        <el-table-column label="品牌" prop="brand">
        </el-table-column>
        <el-table-column  label="计量单位" prop="unitname" width="120">
        </el-table-column>
        <el-table-column label="型号" prop="modelNumber">
        </el-table-column>
        <el-table-column label="IMEI号" prop="imeiNumber">
        </el-table-column>
        <el-table-column  label="产地"  prop="place">
        </el-table-column>
        <el-table-column label="供应商" prop="supplier_name">
        </el-table-column>
        <el-table-column label="库存总量" prop="amount" width="120">
        </el-table-column>
        <el-table-column label="说明" prop="illustrate">
        </el-table-column>
    </el-table>

    	<el-dialog :title="dialogtitle" v-model="commodityDialogVisible">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
				<el-row>
					<el-col :span="11"><el-form-item label="商品编号" prop="commodity_id">
						<el-input v-model="ruleForm.commodity_id":disabled="!saveOrchange"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="商品名称" prop="commodity_name">
						<el-input v-model="ruleForm.commodity_name"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
          <el-form-item label="商品类型" prop="category">
						<el-select v-model="ruleForm.category" placeholder="请选择">
              <el-option v-for="item in categoryoptions" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
					</el-form-item>
          </el-col>
				<el-col :span="12"><el-form-item label="供应商" prop="supplier">
						<el-select v-model="ruleForm.supplier" placeholder="请选择">
              <el-option v-for="item in supplieroptions" :label="item.supplier_name" :value="item.supplier_id"></el-option>
            </el-select>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="计量单位" prop="unit">
            <el-select v-model="ruleForm.unit" placeholder="请选择">
              <el-option v-for="item in unitoptions" :label="item.unitname" :value="item.id"></el-option>
            </el-select>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="型号" prop="modelNumber">
						<el-input v-model="ruleForm.modelNumber"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="IMEI号" prop="imeiNumber">
						<el-input v-model="ruleForm.imeiNumber"></el-input>
					</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="库存总量" prop="amount">
						<el-input v-model="ruleForm.amount"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="11"><el-form-item label="产地" prop="place">
						<el-input v-model="ruleForm.place"></el-input>
					</el-form-item></el-col>
          	<el-col :span="12"><el-form-item label="品牌" prop="brand">
						<el-input v-model="ruleForm.brand"></el-input>
					</el-form-item></el-col>
				</el-row>
				<el-row>
					<el-col :span="23">
						<el-form-item label="说明" prop="illustrate">
							<el-input  type="textarea"  :rows="2"  placeholder="请输入内容"  v-model="ruleForm.illustrate"></el-input>
						</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="addCommodity()" v-if="saveOrchange">增加</el-button>
					<el-button type="primary" @click.native="changeCommodity()" v-else>保存</el-button>
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
        categoryoptions:[],
        unitoptions:[],
        supplieroptions:[],
				saveOrchange:false,
				dialogtitle:'',
				commodity: [],
        commodityDialogVisible:false,
        currentRow: null,
        ruleForm:{
            commodity_id:'',
            commodity_name:'',
            category:'',
            brand:'',
            unit:'',
            modelNumber:'',
            imeiNumber:'',
            amount:'',
            place:'',
            supplier:'',
            illustrate:''
        },
        rules: {
				commodity_id: [
					{ required: true, message: '请输入商品编号', trigger: 'blur' },
				],
        name:[
					{ required: true, message: '请输入商品名称', trigger: 'blur' },
                ]
                }
			}
		},
		methods: {
      getSupplier: function () {
        let url = '/api/management/searchSupplier'
        this.$http.get(url).then(response => {
            if(response.data.errorcode === '200'){
                this.supplieroptions = response.data.data
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
      searchUnit(){
			let url = '/api/management/searchUnits'
			this.$http.get(url).then(response => {
				this.unitoptions = response.data.data
			}, response => {
					console.log('error submit!!');
					return false;
				});
		},
      getCategory(){
			var array = new Array()
			var a ,b
			let url = '/api/management/searchCategory'
			this.$http.get(url).then(response => {
				this.categoryoptions = response.data.data
			}, response => {
					console.log('error getCategory!!');
					return false;
				});
		},
		newCommodity(){
			this.commodityDialogVisible=true
			this.dialogtitle='增加商品'
			this.saveOrchange=true
			this.ruleForm = {
                    commodity_id:'',
                    commodity_name:'',
                    category:'',
                    brand:'',
                    unit:'',
                    modelNumber:'',
                    imeiNumber:'',
                    amount:0,
                    place:'',
                    supplier:'',
                    illustrate:''
                }
		},
    handleCurrentChange(val) {
			this.currentRow = val;
		    },
	getCommodity: function () {
        let url
        if(this.filters.name){
            url = '/api/management/searchCommodities?commodity_name='+ this.filters.name
        } else {
            url = '/api/management/searchCommodities'
        }
				  this.loading = true;
				  NProgress.start();
          this.$http.get(url).then(response => {
              if(response.data.errorcode === '200'){
                  this.commodity = response.data.data
                  console.log(response.data)
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
      deleteCommodity(){
          if(!this.currentRow){
              this.$message.error('请选择要删除的一列');
          } else{
					let url = '/api/management/deleteCommodities?commodity_id=' + this.currentRow.commodity_id
					this.$http.get(url).then(response => {
						console.log(response.data)
						if(response.data.errorcode === '200'){
							this.$message({
							message: response.data.errormsg,
							type: 'success'
							});
							this.getCommodity()
						} else {
							this.$message({
								message: response.data.errormsg,
								type: 'warning'
							});
						}
					}, response => {
							console.log('error deletecommodity!!');
							return false;
						});
			    }
            },
            resetForm(formName) {
			this.$refs[formName].resetFields();
		    },
      addCommodity(){
          let url = '/api/management/addCommodities'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var time = Date.parse(new Date());
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'commodity_id=' + this.ruleForm.commodity_id +
				'&commodity_name='+ this.ruleForm.commodity_name+
				'&category_id=' + this.ruleForm.category +
				'&brand=' + this.ruleForm.brand+
				'&unit_id='+this.ruleForm.unit+
				'&modelNumber='+this.ruleForm.modelNumber+
				'&imeiNumber='+ this.ruleForm.imeiNumber +
				'&amount='+ this.ruleForm.amount +
				'&place='+ this.ruleForm.place +
				'&supplier_id='+ this.ruleForm.supplier +
				'&illustrate='+ this.ruleForm.illustrate +
				'&createId='+ user.id
			console.log(parameter)
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.commodityDialogVisible = false
					this.getCommodity()
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
			modifyCommodity(){
			if(!this.currentRow){
				this.$message.error('请选择要修改的一列');
			} else{
				this.commodityDialogVisible=true
				this.dialogtitle='修改商品信息'
				this.saveOrchange = false
				this.ruleForm = {
                    commodity_id:this.currentRow.commodity_id,
                    commodity_name:this.currentRow.commodity_name,
                    category:this.currentRow.category_id,
                    brand:this.currentRow.brand,
                    unit:this.currentRow.unit_id,
                    modelNumber:this.currentRow.modelNumber,
                    imeiNumber:this.currentRow.imeiNumber,
                    amount:this.currentRow.amount,
                    place:this.currentRow.place,
                    supplier:this.currentRow.supplier_id,
                    illustrate:this.currentRow.illustrate===null?'':this.currentRow.illustrate
                }
				console.log(this.ruleForm)
			}
		},
		changeCommodity(){
			let url = '/api/management/modifyCommodities'
			var user = JSON.parse(sessionStorage.getItem('user'));
			var header= {'content-type': 'application/x-www-form-urlencoded'}
			let parameter =	'commodity_id=' + this.ruleForm.commodity_id +
				'&commodity_name='+ this.ruleForm.commodity_name+
				'&category_id=' + this.ruleForm.category +
				'&brand=' + this.ruleForm.brand+
				'&unit_id='+this.ruleForm.unit+
				'&modelNumber='+this.ruleForm.modelNumber+
				'&imeiNumber='+ this.ruleForm.imeiNumber +
				'&amount='+ this.ruleForm.amount +
				'&place='+ this.ruleForm.place +
				'&supplier_id='+ this.ruleForm.supplier +
				'&illustrate='+ this.ruleForm.illustrate +
				'&createId='+ user.id
			this.$http.post(url,parameter,{headers:header}).then(response => {
				if(response.data.errorcode === '200'){
					this.$message({
						message: response.data.errormsg,
						type: 'success'
						});
					this.commodityDialogVisible = false
					this.getCommodity()
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
      this.getCategory()
      this.searchUnit()
      this.getSupplier()
    }
	};
</script>
<style scoped>

</style>