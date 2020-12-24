<template>
    <el-row class="baseHeader">
        <el-col :span="4">
            <div class="grid-content bg-purple logoBox">
            <img class="logo" src="../assets/images/logo.png" alt />
            </div>
        </el-col>
        <el-col :span="16">
            <div  class="grid-content logoCenter bg-purple-light">
                <img src="../assets/images/headertitle.png" alt="">
             </div>
        </el-col>
        <el-col :span="4">
            <div class="grid-content bg-purple time">
                <div class="userName">
                    <img src="../assets/images/user_img.png" alt />
                    <span>{{fireUnitName}}：{{userName}}</span>
                </div>
                <div @click="logout"  class="logout">
                    <img src="../assets/images/logout_img.png" alt />
                    <span>注销</span>
                </div>
            </div>
      </el-col>
    </el-row>
</template>

<script>
export default {
    computed: {
        userName: function() {
            return this.$store.state.userInfo.name;
        },
        fireUnitName: function() {
            return this.$store.state.userInfo.fireUnitName;
        }
    },
    methods:{
        //注销登录
        logout(){
            this.$confirm('确定注销登录吗？', '退出', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post(this.$api.UserLogout).then(()=>{
                    //   console.log('注销登录成功',res)
                        localStorage.clear();
                        this.$router.push({
                            name:'login'
                        })
                        this.$message({
                            message: '注销登录成功',
                            type: 'success'
                        });
                })
            }).catch(() => {
                    
            });
        }
    }
}
</script>

<style lang="less">
    .baseHeader{
        min-height: 74px;
        width: 100%;
        padding: 10px 20px;
        background: #00060e;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background: url('../assets/images/headerbg.png') no-repeat;
        background-size: contain;
        background-position:50%;
        .logoBox {
            height: 56px;
            display: flex;
            align-items: center;
            .logo {
            width: 136px;
            height: 46px;
            }
        }
        .logoCenter {
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .time{
            display: flex;
            height: 56px;
            align-items: center;
            font-size: 14px;
            justify-content: right;
            .userName,
            .logout {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #7ec9fe;
            margin:0px 10px;
            cursor: pointer;
                img {
                    width: 18px;
                    height: 18px;
                    margin-right: 6px;
                }
            }
        }
    }
</style>