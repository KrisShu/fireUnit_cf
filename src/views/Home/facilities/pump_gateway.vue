<template>
    <div class="pump_gateway">
        <div class="topselect">
            <el-form :inline="true" :model="selectform" class="demo-form-inline">
                <el-form-item label="部件编号">
                    <el-input clearable v-model="selectform.sn" placeholder="部件编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button @click="add" type="primary">增加</el-button>
        </div>
        <baseTable 
            :columnList='columnList' 
            :tableData ='tableData'
            tableName='pump'
            @deleteData="deleteData"
      ></baseTable>
      <basePage :propPage="page" @currentChange="GetPumpList"></basePage>

      <!-- 新增弹窗 -->
       <basedialog :footershow="true" @submit="submit" title="启泵部件管理" ref="add_detailDialog">
            <el-form :model="add_detailForm"   :rules="rules" ref="add_detailForm" label-width="100px" class="add_detailForm">
                <el-form-item label="网关编号:" prop="gatewaySn">
                    <el-input v-model="add_detailForm.gatewaySn"></el-input>
                </el-form-item>
                <el-form-item label="部件编号:" prop="detectorSn">
                    <el-input v-model="add_detailForm.detectorSn"></el-input>
                </el-form-item>
            </el-form>
       </basedialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selectform:{
                sn:''
            },
            columnList:[
                {
                    prop:'gatewaySn',
                    label:'网关编号'
                },
                {
                    prop:'detectorSn',
                    label:'部件编号'
                },
                {
                    prop:'detectorType',
                    label:'部件类型'
                },
                {
                    label:'操作'
                },
            ],
            tableData:[],
            page:{
                DetectorSn:'',
                SkipCount:0,
                MaxResultCount:9,
                total:0
            },
            add_detailForm:{
                gatewaySn:'',
                detectorSn:''
            },
            rules: {
                gatewaySn: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                detectorSn: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.GetPumpList()
    },
    methods:{
        //获取启泵列表
        GetPumpList(){
            this.$axios.get(this.$api.GetPumpList,{params:this.page}).then(res=>{
                console.log("列表",res);
                ({items: this.tableData,totalCount: this.page.total} = res.result);
            })
        },
        onSubmit(){
            console.log(this.selectform)
            this.page.DetectorSn = this.selectform.sn
            this.GetPumpList();
        },
        //打开新增弹窗
        add(){
            this.$refs.add_detailDialog.dialogVisible = true
        },
        deleteData(rowdata){
            this.$axios.delete(this.$api.DeletePump,{params:{id:rowdata.dataId}}).then(res=>{
                if(res.success){
                    this.$message({
                        message:'删除设备成功',
                        type: 'success'
                    });
                    this.$refs.add_detailDialog.dialogVisible = false
                }
                this.GetPumpList();
            })
        },
        //新增提交
        submit(){
            this.$refs.add_detailForm.validate((valid) => {
                if(valid){
                    this.$axios.post(this.$api.AddPump,this.add_detailForm).then(res=>{
                        if(res.success){
                            this.$message({
                                message:'新增设备成功',
                                type: 'success'
                            });
                            this.$refs.add_detailDialog.dialogVisible = false
                        }
                        this.GetPumpList();
                    }).catch(err=>{
                        this.$message({
                            message:err.data.error.message,
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
    .pump_gateway{
        .topselect{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 0px;
            &>.el-form-item{
                margin-bottom: 0;
            }
        }
    }
</style>