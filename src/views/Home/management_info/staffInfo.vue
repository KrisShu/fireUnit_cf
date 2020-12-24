<template>
  <div class="staffInfo">
        <div class="addbtn">
            <el-button @click="add" icon="el-icon-circle-plus-outline" type="primary">新增</el-button>
        </div>
        <baseTable 
          :columnList='columnList' 
          :tableData ='tableData'
          tableName='staffInfo'
          @deleteData="deleteData"
          @getdetails="getdetails"
          @resetpassword="resetpassword"
        ></baseTable>
        <!-- 新增和详情 -->
        <basedialog @submit="submit" :footershow="true" title="工作人员" ref="add_detailDialog">
            <el-form :model="add_detailForm" :rules="rules" ref="add_detailForm" label-width="100px" class="add_detailForm">
                <el-form-item label="账号:" prop="account">
                    <el-input v-model="add_detailForm.account"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="add_detailForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色:" prop="role">
                    <el-select v-model="add_detailForm.role" placeholder="请选择活动区域">
                        <el-option label="系统管理员" value="系统管理员"></el-option>
                        <el-option label="消防值班员" value="消防值班员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </basedialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            columnList:[
                {
                    prop:'account',
                    label:'账号'
                },
                {
                    prop:'name',
                    label:'姓名'
                },
                {
                    prop:'role',
                    label:'角色'
                },
                {
                    label:'操作'
                }
            ],
            tableData:[],
            page:{
                fireUnitId:this.$store.state.userInfo.fireUnitID,
                SkipCount:0,
                total:0,
                MaxResultCount:6,
            },
            add_detailForm:{
                account:'',
                name:'',
                role:'系统管理员',
                fireUnitID:this.$store.state.userInfo.fireUnitID,
            },
            rules: {//表单检验规则
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                role: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
            }
        }
    },
    created(){
        this.GetUserList();
    },
    methods:{
        //获取人员列表
        GetUserList(){
            this.$axios.get(this.$api.GetUserList,{params:this.page}).then(res=>{
                // console.log("获取人员列表",res);
                ({items: this.tableData,totalCount: this.page.total} = res.result);
            })
        },
        //打开新增人员弹窗
        add(){
            this.add_detailForm.id = ''
            this.add_detailForm.fireUnitID = this.$store.state.userInfo.fireUnitID;
            this.$refs.add_detailDialog.dialogVisible  = true
            this.$nextTick(()=>{
                this.$refs.add_detailForm.resetFields();
            })
            
        },
        submit(){
            this.$refs.add_detailForm.validate((valid) => {
                if(valid){
                    let axios = this.add_detailForm.id ? this.$axios.put(this.$api.UpdateUserInfo,this.add_detailForm) :
                    this.$axios.post(this.$api.AddUser,this.add_detailForm);

                    axios.then(res=>{
                        // console.log("新增人员成功",res)
                        if(res.success){
                            let message =   this.add_detailForm.id ? '修改人员信息成功':'新增人员成功'
                            this.$message({
                                message,
                                type: 'success'
                            });
                            this.$refs.add_detailDialog.dialogVisible = false
                        }
                        this.GetUserList();
                    }).catch(err=>{
                             this.$message({
                                message:err.data.error.message,
                                type: 'error'
                            });
                    })
                }
            })
        },
        //
        getdetails(rowdata){
             this.$refs.add_detailDialog.dialogVisible  = true;
             this.GetUserInfo(rowdata.id)
        },
        GetUserInfo(userId){
            this.$axios.get(this.$api.GetUserInfo,{params:{userId}}).then(res=>{
                this.add_detailForm = res.result
            })
        },
        //删除数据
        deleteData(rowdata){
            this.$axios.delete(this.$api.DeleteUser,{params:{userId:rowdata.id}}).then(res=>{
                if(res.success){
                    this.$message({
                        message:'删除数据成功',
                        type: 'success'
                    });
                }
                this.GetUserList();
            })
        },
        //重置密码
        resetpassword(rowdata){
            let formdata = new FormData();
            formdata.append('userId',rowdata.id)
            this.$axios.post(this.$api.ReSetPassword,formdata).then(res=>{
                if(res.success){
                    this.$message({
                        message:'重置密码成功',
                        type: 'success'
                    });

                }
            })
        }
    }
}
</script>

<style lang="less">
    .staffInfo{
        height: 100%;
        display: flex;
        flex-direction: column;
        .addbtn{
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }
        &>:nth-child(2){
            flex: 2 0 auto;
        }
    }
</style>