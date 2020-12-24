<template>
  <div class="login">
    <div class="login_centerBg">
        <el-form ref="form" :rules="rules" :model="lofin_form" >
            <el-form-item class="title" >
               <img class="login_text" src="../assets/images/logintext.png" alt="">
            </el-form-item>
            <el-form-item  prop="account">
                <el-input placeholder="请输入您的账号" v-model="lofin_form.account">
                     <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" >
                <el-input placeholder="请输入您的密码" v-model="lofin_form.password">
                     <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit"></el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            lofin_form:{
                account:'',
                password:''
            },
            rules: {
                account: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            
            },

        }
    },
    methods:{
        onSubmit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios.post(this.$api.UserLogin,this.lofin_form).then(res=>{
                        console.log('登录成功',res)
                        this.$store.commit("setUserInfo", res.result);
                        localStorage.setItem('userinfo',JSON.stringify(res.result))
                        localStorage.setItem('islogin',true)
                        this.$router.push(
                            {path:'/'}
                        )
                    }).catch(err=>{
                        // console.log('登录失败', this.$axios.defaults.baseURL)
                        this.$message.error(err.data.error.message);
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.login{
    width: 100vw;
    height: 100vh;
    background: url('../assets/images/load_img_bg.png');
    background-size: 100% 100%;
    position: relative;
    .login_centerBg{
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: url('../assets/images/load_img_bg01.png');
        width: 786px;
        height: 400px;
        background-size: 100% 100%;
        .el-form{
            width: 43%;
            height: 100%;
            position: absolute;
            right: 0px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            // background: violet;
            .title{
                .login_text{
                     margin-top: 80px;
                }
            }
            .el-form-item{
                input{
                    height: 40px;
                    width: 264px;
                    border: none;
                    background: #1F3769;
                    color: white;
                    // padding-left: 10px;
                    &::placeholder{
                        color: #fff;
                    }
                }
                button{
                    width: 264px;
                    background: url('../assets/images/load_btn_load.png');
                    height: 40px;
                    border: none;
                    background-size: 100% 100%;
                }
                .el-form-item__error{
                    color: #3B84EE;
                }
            }
        }
    }
}
</style>