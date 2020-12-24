<template>
    <div class="updatepassword">
      <p class="title">修改密码</p>
      <el-form :rules="rules" ref="updateform" :model="updateform" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="updateform.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updateform.newPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  data(){
    return{
      rules: {
          oldPassword: [
            { required: true, message: '请输入原始密码', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ]
      },
      updateform:{
        userId:this.$store.state.userInfo.userId,
        oldPassword:'',
        newPassword:'',
      }
    } 
  },
  methods:{
    onSubmit(){
      this.$refs['updateform'].validate((valid) => {
        if (valid) {
          console.log("可以")
            this.$axios.post(this.$api.ChangePassword,this.updateform).then(res=>{
              console.log("修改密码",res)
              if(res.success){
                  this.$axios.post(this.$api.UserLogout).then(()=>{
                    //   console.log('注销登录成功',res)
                        localStorage.clear();
                        this.$router.push({
                            name:'login'
                        })
                        this.$message({
                            message: '修改密码成功需重新登录',
                            type: 'success'
                        });
                  })
              }
            }).catch(err=>{
              this.$message({
                  message: err.data.error.message,
                  type: 'error'
              });
            })
        }
      })
    }
  }
}
</script>

<style lang="less">
  .updatepassword{
      width: 30%;
      padding-top: 50px;
      .title{
        text-align: center;
        color: white;
        margin-bottom: 20px;
      }
  }
</style>
