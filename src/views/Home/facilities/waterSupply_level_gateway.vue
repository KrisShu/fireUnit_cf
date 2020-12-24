<template>
    <div class="waterSupply_level_gateway">
        <basescreenbtnAdd 
        :top_screen_btn="top_screen_btn"
        @topScreen="topScreen"
        @add='add'
        ></basescreenbtnAdd>
        <baseTable 
            :columnList='columnList' 
            :tableData ='tableData'
            tableName='waterSupply_level_gateway'
            @getdetails="getdetails"
            @deleteData='deleteData'
            @showtrend="showtrend"
        ></baseTable>
        <!-- 新增和详情 -->
        <!-- 新增和详情的弹窗 -->
        <basedialog :footershow="true" @submit="submit" title="消防供水网关维护" ref="add_detailDialog">
            <el-form :model="add_detailForm" :rules="rules" ref="add_detailForm" label-width="100px" class="add_detailForm">
                <el-form-item label="网关编号:" prop="gatewaySn">
                    <el-input v-model="add_detailForm.gatewaySn"></el-input>
                </el-form-item>
                <el-form-item label="品牌:" prop="brand">
                    <el-input v-model="add_detailForm.brand"></el-input>
                </el-form-item>
                <el-form-item label="型号:" prop="model">
                    <el-input v-model="add_detailForm.model"></el-input>
                </el-form-item>
                <el-form-item label="管理建筑：" prop="architectureId">
                    <el-select @change='GetFloorDropdown' v-model="add_detailForm.architectureId" placeholder="请选择建筑">
                        <el-option 
                        v-for="(arr,index) in ArchitectureList" 
                        :key="index" 
                        :label="arr.name" 
                        :value="arr.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼层：" prop="floorId">
                    <el-select v-model="add_detailForm.floorId" placeholder="请选择建筑">
                        <el-option 
                        v-for="(arr,index) in floorList" 
                        :key="index" 
                        :label="arr.name" 
                        :value="arr.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部件类型:" >
                    <el-input disabled placeholder="液位监测"></el-input>
                </el-form-item>
                <el-form-item label="部件编号：" prop="detectorSn">
                    <el-input v-model="add_detailForm.detectorSn"></el-input>
                </el-form-item>
                <el-form-item label="安装位置:" prop="address">
                    <el-input v-model="add_detailForm.address"></el-input>
                </el-form-item>
                <el-form-item class="range" label="监测范围：" prop="minThreshold">
                    <el-input v-model="add_detailForm.minThreshold">
                        <template slot="append">m</template>
                    </el-input>
                    <span>——</span>
                    <el-input v-model="add_detailForm.maxThreshold">
                        <template slot="append">m</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </basedialog>
        <!--  -->
        
        <!-- 趋势 -->
        <baseTrend ref="baseTrend"></baseTrend>
    </div>
</template>

<script>

    let moment = require('moment');
  import baseTrend from '../../../components/baseTrend'
export default {
  components:{
    baseTrend
  },
    data(){
        return{
            top_screen_btn:[
                {
                    text:'全部',
                    class:'blue'
                },
                {
                    text:'正常',
                    class:'green',
                    num:0
                },
                {
                    text:'故障',
                    class:'yellow',
                    num:0
                },
                {
                    text:'超限',
                    class:'orange',
                    num:0
                },
                {
                    text:'离线',
                    class:'gary',
                    num:0
                },
            ],
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
                    prop:'architectureName',
                    label:'建筑'
                },
                {
                    prop:'floorName',
                    label:'楼层'
                },
                {
                    prop:'address',
                    label:'安装位置'
                },
                {
                    prop:'state',
                    label:'状态'
                },
                {
                    prop:'currentValue',
                    label:'数值'
                },
                {
                    label:'操作'
                }
            ],
            tableData:[ ],
            add_detailForm:{
                fireUnitId:this.$store.state.userInfo.fireUnitID,
                gatewaySn:'',//网关编号
                brand:'',//品牌
                model:'',//型号
                architectureId:'',//建筑
                floorId:'',//楼层id
                monitorType:1,//
                detectorSn:'',//部件编号
                address:'',//安装位置
                minThreshold:'',
                maxThreshold:'',
            },
            page:{
                FireUnitId:this.$store.state.userInfo.fireUnitID,
                MonitorType :1,
                State:0,
                SkipCount:0,
                total:0,
                MaxResultCount:6
            },
            ArchitectureList:[],//选择建筑列表
            floorList:[],//某建筑下的楼层列表
            rules: {
                deviceSn: [
                    { required: true, message: '请输入网关编号', trigger: 'blur' }
                ],
                detectorSn: [
                    { required: true, message: '请输入部件编号', trigger: 'blur' }
                ],
                minThreshold: [
                    { required: true, message: '请输入监测范围', trigger: 'blur' }
                ],
                architectureId: [
                    { required: true, message: '请选择建筑', trigger: 'change' }
                ],
            }
        }
    },
    created(){
        this.GetArchitectureList();
        this.GetWaterDetectorList();
        this.GetWaterGatewayStatusNum();
    },
    methods:{
        //获取建筑下拉列表
        GetArchitectureList(){
            this.$axios.get(this.$api.GetArchitectureList,{params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}).then(res=>{
                console.log("获取建筑下拉列表",res)
                this.ArchitectureList = res.result
            })
        },
        //获取某建筑下的楼层
        GetFloorDropdown(architectureId){
            console.log(architectureId)
            this.$axios.get(this.$api.GetFloorDropdown,{params:{architectureId}}).then(res=>{
                console.log("获取某建筑下的楼层")
                this.floorList = res.result;
                this.add_detailForm.floorId ='';
            })
        },
        GetFloorDropdown_2(architectureId){
            console.log(architectureId)
            this.$axios.get(this.$api.GetFloorDropdown,{params:{architectureId}}).then(res=>{
                console.log("获取某建筑下的楼层")
                this.floorList = res.result;
            })
        },
        //获取状态
        GetWaterGatewayStatusNum(){
            this.$axios.get(this.$api.GetWaterGatewayStatusNum,{params:this.page}).then(res=>{
                this.top_screen_btn[1].num = res.result[0].value
                this.top_screen_btn[2].num = res.result[1].value
                this.top_screen_btn[3].num = res.result[2].value
                this.top_screen_btn[4].num = res.result[3].value
            })
        },
        //获取消防液位列表
        GetWaterDetectorList(){
            this.$axios.get(this.$api.GetWaterDetectorList,{params:this.page}).then(res=>{
                console.log('获取液位列表',res);
                ({items: this.tableData,totalCount: this.page.total} = res.result);
            })
        },
        //顶部筛选
        topScreen(text){
            console.log("topScreen",text)
            if(text == '全部'){
                this.page.State = 0
            }else if(text == '正常'){
                this.page.State = 1
            }else if(text == '故障'){
                this.page.State = 2
            }else if(text == '超限'){
                this.page.State = 4
            }else if(text == '离线'){
                this.page.State = -1
            }
            this.GetWaterDetectorList();
        },
        // 新增
        add(){
            this.$refs.add_detailDialog.dialogVisible  = true
            this.$nextTick(()=>{
                this.$refs.add_detailForm.resetFields();
            })
            this.add_detailForm.gatewayId = ''
            this.add_detailForm.fireUnitId = this.$store.state.userInfo.fireUnitID
            this.add_detailForm.maxThreshold =''
        
        },
        //新增和修改提交
        submit(){
            this.$refs.add_detailForm.validate((valid) => {
                if(valid){
                    // console.log(this.add_detailForm);
                    let axios = this.add_detailForm.gatewayId ? this.$axios.put(this.$api.UpdateGateway_water,this.add_detailForm) :
                    this.$axios.post(this.$api.AddGateway_water,this.add_detailForm);
                    axios.then(res=>{
                        // console.log("新增设备成功",res)
                        if(res.success){
                            let message =   this.add_detailForm.gatewayId ? '修改设备成功':'新增设备成功'
                            this.$message({
                                message,
                                type: 'success'
                            });
                            this.$refs.add_detailDialog.dialogVisible = false
                        }
                        this.GetWaterDetectorList();
                        this.GetWaterGatewayStatusNum();
                    }).catch(err=>{
                            this.$message({
                                message:err.data.error.message,
                                type: 'error'
                            });
                    })
                }
            })
        },
        //打开获取详情弹窗
        getdetails(rowdata){
            this.$refs.add_detailDialog.dialogVisible  = true
            this.GetWaterGatewayInfo(rowdata.gatewayId)
        },
        //获取详情
        GetWaterGatewayInfo(gatewayId){
            this.$axios.get(this.$api.GetWaterGatewayInfo,{params:{gatewayId}}).then(res=>{
                // console.log('获取某个设备的详情',res)
                this.add_detailForm = res.result
                this.GetFloorDropdown_2(res.result.architectureId)
            })
        },
        //删除数据
        deleteData(rowdata){
            // console.log(rowdata)
            this.$axios.delete(this.$api.DeleteGateway_water,{params:{gatewayId:rowdata.gatewayId}}).then(()=>{
                // console.log("删除数据",res)
                this.$message({
                    message:'删除数据成功',
                    type: 'success'
                });
                this.GetWaterDetectorList();
                this.GetWaterGatewayStatusNum();
            })
        },
        showtrend(item){
            console.log(item)
            this.$refs.baseTrend.dialogVisible = true;
            this.$refs.baseTrend.detectorId = item.detectorId;
            this.$refs.baseTrend.trend_date[0] = moment().subtract(1,'months').format('YYYY-MM-DD')
            this.$refs.baseTrend.trend_date[1] = moment().format('YYYY-MM-DD')
            this.$refs.baseTrend.monitorItemName = '液位'
            this.$refs.baseTrend.monitorItemFlag = 'H'
            this.$refs.baseTrend.gettrendData();
        }
    }
}
</script>

<style lang="less" scoped>
    .waterSupply_level_gateway{
        height: 100%;
        display: flex;
        flex-direction: column;
        &>:nth-child(2){
            flex: 2 0 auto;
        }
        .add_detailForm{
            .range{
                .el-form-item__content{
                    display: flex;
                    justify-content: space-between;
                    &>span{
                        margin: 0 6px;
                    }
                    .el-input{
                            width: 45%;
                    }
                }
                
            }
        }   
    }
</style>