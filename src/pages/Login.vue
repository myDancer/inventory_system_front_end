<template>
<div>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-row >
      <el-col :span="10">
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      </el-col>
      <el-col :span="14">
      <el-button type="text" @click.native="registerDialogVisible=true" class="register">还没账号，点击注册</el-button>
      </el-col>
    </el-row>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
  <el-dialog title="用户注册" v-model="registerDialogVisible" size="small">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" style="width:500px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right:100px;">
      <el-button type="primary" @click="doRegister()">立即注册</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import routes from '../routes'
  import allroutes from '../allroutes'
  import Stock from './nav4/stock.vue'
  import Home from './Home.vue'
  export default {
    data() {
      return {
        logining: false,
        powerWord:'',
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        ruleForm:{
          username:'',
          password:''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        registerDialogVisible:false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            NProgress.start();
            let url = '/api/login?userName=' + this.ruleForm2.account + '&passWord=' + this.ruleForm2.checkPass
            this.$http.get(url).then(response => {
              this.logining = false;
              NProgress.done();
              let { data, errorcode, errormsg } = response.data;
              if (errorcode !== '200') {
                this.$notify({
                  title: '错误',
                  message: errormsg,
                  type: 'error'
                });
              } else {
                let user =  {
                  id: data.id,
                  username: this.ruleForm2.account,
                  avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
                  name: this.ruleForm2.account
                }
                sessionStorage.setItem('user', JSON.stringify(user));
                this.switchPower(data.power)
                this.$router.push({ path: '/accountCharts' });
                var message =  '欢迎回来！'+ this.ruleForm2.account
                 this.$notify({
                    title: this.powerWord,
                    message: message,
                    type: 'success'
                  });
              }
            }, response => {
              console.log('error submit!!');
              return false;
            });
          }
        })
      },
      doRegister(){
        let url = '/api/login/register?userName=' + this.ruleForm.username + '&passWord=' + this.ruleForm.password
        this.$http.get(url).then(response => {
          console.log(response.data)
          let { data, errorcode, errormsg } = response.data;
            if (errorcode !== '200') {
              this.$notify({
                title: '错误',
                message: errormsg,
                type: 'error'
              });
            } else {
              this.$notify({
                title: '注册成功',
                message: errormsg,
                type: 'success'
              });
              this.registerDialogVisible = false;
            }
          }, response => {
            console.log('error submit!!');
            return false;
          });
      },
      switchPower(power){
        switch (power) {
          case 0:
              this.powerWord='系统管理员'
              var routers = this.$router.options.routes
              var router0 = allroutes.adminroutes
              routers.push(router0)
              this.$router.addRoutes(router0)
              this.$router.options.routes = router0
              console.log(this.$router.options.routes)
              break;
          case 1:
              this.powerWord='采购员'
              var routers = this.$router.options.routes
              var router1 = allroutes.caigouroutes
              routers.push(router1[0])
              this.$router.addRoutes(router1)
              this.$router.options.routes = router1
              console.log(this.$router.options.routes)
              break;
          case 2:
              this.powerWord='销售员'
              var routers = this.$router.options.routes
              var router2 = allroutes.xiaoshouroutes
              routers.push(router2[0])
              this.$router.addRoutes(router2)
              this.$router.options.routes = router2
              console.log(this.$router.options.routes)
              break;
          case 3:
              this.powerWord='仓库员'
              var routers = this.$router.options.routes
              var router3 = allroutes.kucunroutes
              routers.push(router3[0])
              this.$router.addRoutes(router3)
              this.$router.options.routes = router3
              console.log(this.$router.options.routes)
              break;
          case 4:
              this.powerWord='财务员'
              var routers = this.$router.options.routes
              var router4 = allroutes.zhangwuroutes
              routers.push(router4[0])
              this.$router.addRoutes(router4)
              this.$router.options.routes = router4
              console.log(this.$router.options.routes)
              break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .register{
      margin:-4px 0px 0px 0px;
    }
  }
</style>