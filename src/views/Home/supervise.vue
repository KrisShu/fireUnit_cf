<template>
    <el-container class="supervise">
        <div class="toptime">
            <p>每五秒自动刷新,上一次刷新：{{refreshTime}}</p>
        </div>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple-left">
                        <div class="bg-purple-top-title">
                            报警核警
                        </div>
                        <ul v-if="DefaultPageDataList.data_Alarm.length>0" class="ulbox bg-content">
                             <el-scrollbar>
                                <li 
                                    v-for="arr in DefaultPageDataList.data_Alarm" 
                                    :key="arr.alarmDataId"
                                    style="borderColor:#ED7D31" 
                                    class="liitem"
                                >
                                    <p><span>时间：</span>{{arr.creationTime | delTime(arr.creationTime)}}</p>
                                    <p><span>部件：</span>{{arr.detectorSn}}</p>
                                    <p><span>类型：</span>{{arr.detectorType}}</p>
                                    <p><span>位置：</span>{{arr.location}}</p>
                                    <div class="btns">
                                        <el-button size="small" @click="getlocation(arr.detectorId)" type="primary">定位</el-button>
                                        <el-button  size="small" @click="check(arr.alarmDataId)" class="checkbtn" type="success">核警</el-button>
                                    </div>
                                   
                                </li>
                             </el-scrollbar>
                        </ul>
                        <p v-else class="noData">暂无数据</p>
                    </div>
                </el-col>
                <el-col :span="8">
                     <div class="grid-content bg-purple-cneter">
                            <div style=" background:#4472C4;" class="bg-purple-top-title">
                                故障处理
                            </div>
                            <ul v-if="DefaultPageDataList.data_Fault.length>0" class="ulbox bg-content">
                                <el-scrollbar>
                                    <li 
                                        v-for="arr in DefaultPageDataList.data_Fault" 
                                        :key="arr.faultDataId"
                                        style="borderColor:#4472C4" 
                                        class="liitem"
                                    >
                                        <p><span>时间：</span>{{arr.creationTime | delTime(arr.creationTime)}}</p>
                                        <p><span>部件：</span>{{arr.detectorSn}}</p>
                                        <p><span>类型：</span>{{arr.detectorType}}</p>
                                        <p><span>位置：</span>{{arr.location}}</p>
                                        <p><span>故障：</span>{{arr.faultType}}</p>
                                        <div class="btns">
                                            <el-button size="small" @click="getlocation(arr.detectorId)" type="primary">定位</el-button>
                                            <el-button  @click="deal(arr.faultDataId)" size="small" class="dealbtn" type="success">处理</el-button>
                                        </div>
                                    
                                    </li>
                                </el-scrollbar>
                            </ul>
                            <p v-else class="noData">暂无数据</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-right top">
                        <div style=" background:#70AD47;" class="bg-purple-top-title">
                            管理信息
                        </div>
                        <ul class="ulbox bg-content">
                             <el-scrollbar>
                                <li 
                                    v-for="(arr,index) in DefaultPageDataList.data_ManagerInfo" 
                                    :key="index"
                                    style="borderColor:#70AD47" 
                                    class="liitem"
                                >
                                    <p><span>时间：</span>{{arr.creationTime | delTime(arr.creationTime)}}</p>
                                    <p><span>部件：</span>{{arr.detectorSn}}</p>
                                    <p><span>类型：</span>{{arr.detectorType}}</p>
                                    <p><span>位置：</span>{{arr.location}}</p>
                                    <p><span>事件：</span>{{arr.managerInfo}}</p>
                                </li>
                             </el-scrollbar>
                        </ul>
                    </div>
                    <div class="grid-content bg-purple-right bottom">
                        <div style=" background:#70AD47;" class="bg-purple-top-title">
                            网关状态
                        </div>
                        <ul class="ulbox bg-content">
                             <el-scrollbar>
                                <li 
                                    v-for="(arr,index) in DefaultPageDataList.data_Gateway" 
                                    :key="index"
                                    style="borderColor:#70AD47" 
                                    class="liitem"
                                >
                                    <p>
                                        <span>网关：</span>
                                        {{arr.gatewaySn}}
                                        <el-tooltip class="item" effect="dark" content="在线" placement="top-start">
                                         <img class="isonline" v-if="arr.status == 1" src="../../assets/images/online.png" alt="">
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="离线" placement="top-start">
                                         <img class="isonline" v-if="arr.status == -1" src="../../assets/images/outline.png" alt="">
                                        </el-tooltip>
                                    </p>
                                    <p><span>类型：</span>{{arr.sysType | sysType(arr.sysType)}}</p>
                                    <p><span>建筑：</span>{{arr.architectureName}}</p>
                                   
                                   
                                </li>
                             </el-scrollbar>
                        </ul>
                    </div>
                </el-col>

            </el-row>
        </el-main>
        <!-- 定位弹窗 -->
         <basedialogMark ref="locationDialog" :detectordetail="detectordetail"></basedialogMark>
         <!-- 核警 -->
        <basedialog :footershow="true"  @submit="checkSubmit"  width="30%" title="警情核警" ref="checkDialog">
            <div class="checkDialog">
                <el-form   ref="form" :model="checkForm" label-width="82px">
                    <el-form-item label="核警状态：">
                    <el-radio-group v-model="checkForm.checkState">
                        <el-radio :label="2">误报</el-radio>
                        <el-radio :label="3">测试</el-radio>
                        <el-radio :label="4">真实</el-radio>
                    </el-radio-group>
                    </el-form-item>
                    <el-form-item label="核警说明：">
                    <el-input type="textarea" v-model="checkForm.checkRemark"></el-input>
                    </el-form-item>
                </el-form>
                <div class="partdetail" >
                    <p>
                        <span class="partdetail_title">事件时间：</span>
                        <span>{{checkdetail.creationTime}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">网关编号：</span>
                        <span>{{checkdetail.gatewaySn}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">部件编号：</span>
                        <span>{{checkdetail.detectorSn}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">部件类型：</span>
                        <span>{{checkdetail.detectorType}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">建筑位置：</span>
                        <span>{{checkdetail.location}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">联系人：</span>
                        <span>{{checkdetail.contractUser}}</span>
                    </p>
                    <p>
                        <span class="partdetail_title">数值：</span>
                        <span>{{checkdetail.value}}</span>
                    </p>
                </div>
            </div>
        </basedialog>
        <!-- 处理 -->
        <basedialog :footershow="true"  @submit="dealSubmit"  width="30%" title="故障处理" ref="dealDialog">
            <el-form ref="dealform" :model="dealform" label-width="80px">
                <el-form-item label="处理说明">
                    <el-input type="textarea" rows="4" v-model="dealform.handleRemark"></el-input>
                </el-form-item>
            </el-form>
        </basedialog>
    </el-container>
</template>

<script>
let moment = require('moment');
import AILabel  from 'ailabel'
export default {
    data(){
        return{
            refreshTime:moment().format('YYYY-MM-DD hh:mm:ss'),//刷新时间
            DefaultPageDataList:{
                data_Alarm:[],
                data_Fault:[],
            },//
            detectordetail:{},//某一个部件的具体信息
            gMap:{},//点位图层
            gFeatureLayer:'',
            partlocationICON:require('../../assets/images/partlocation.png'),//部件定位icon
            checkdetail:{},//核警详情
            checkForm:{
                alarmId:'',//alarmId
                userId:this.$store.state.userInfo.userId,//当前登录人员Id
                checkState:2,
                checkRemark:'',

            },//核警数据
            dealform:{
                type:1,
                faultDataId:'',
                handleRemark:'已记录报维保'
            },//处理故障
            timeflag:'',

        }
    },
    created(){
        this.timeflag = setInterval(() => {
            setTimeout(()=>{
                this.refreshTime = moment().format('YYYY-MM-DD hh:mm:ss');
                this.GetDefaultPageDataList();
            })
        }, 5000)
        this.GetDefaultPageDataList();
       
    },
    filters:{
        delTime:(data)=>{
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
            // console.log(data)
        },
        sysType:(data)=>{
            if(data == 1){
                return '火灾自动报警'
            }else if(data == 2){
                 return '可燃气体'
            }else if(data == 3){
                return '电气火灾'
            }else if(data == 4){
                return '消防供水液位'
            }else if(data == 5){
                 return '消防供水压力'
            }
        }
    },
    methods:{
        //获取所有类型的列表
        GetDefaultPageDataList(){
            // console.log(moment().format('YYYY-MM-DD hh:mm:ss'));
            this.$axios.get(this.$api.GetDefaultPageDataList,{params:{num:10}}).then(res=>{
                this.DefaultPageDataList = res.result
            })
        },
        //打开定位弹窗
        getlocation(detectorId){
            //获取某一条的具体信息
            this.$refs.locationDialog.dialogVisible  = true;
            this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId}}).then(res=>{
                // console.log("获取某一条的具体信息",res);
                this.detectordetail = res.result;
                if( this.detectordetail.coordinatePicture){
                    this.detectordetail.coordinatePicture = `${this.$URL}${this.detectordetail.coordinatePicture}`
                }
                    this.$nextTick(()=>{
                        this.$refs.locationDialog.init();
                        this.$refs.locationDialog.createMarker(this.detectordetail)
                    })
               
            })
        },
        //打开核警弹窗
        check(alarmId){
            this.$refs.checkDialog.dialogVisible = true;
            this.checkForm.alarmId = alarmId;
            this.GetAlarmCheckInfo(alarmId)
        },
        //获取核警说明
        GetAlarmCheckInfo(alarmId){
            this.$axios.get(this.$api.GetAlarmCheckInfo,{params:{alarmId}}).then(res=>{
                // console.log("ss",res)
                res.result.creationTime = this.delTime(res.result.creationTime)
                if(res.result.checkTime){
                    res.result.checkTime = this.delTime(res.result.checkTime)
                }
                
                this.checkdetail = res.result;
            })
        },
        //提交核警
        checkSubmit(){
            this.$axios.post(this.$api.CheckAlarm,this.checkForm).then(res=>{
                // console.log("核警提交",res);
                if(res.success){
                    this.$message({
                        message:'核警成功',
                        type: 'success'
                    });
                    this.$refs.checkDialog.dialogVisible = false;
                }   
            })
        },
        //打卡处理弹窗
        deal(faultDataId){
            this.$refs.dealDialog.dialogVisible = true;
            this.dealform.faultDataId = faultDataId
        },
        //提交
        dealSubmit(){
            this.$axios.post(this.$api.HandleFault,this.dealform).then(res=>{
                if(res.success){
                    this.$message({
                        message:'处理成功',
                        type: 'success'
                    });
                    this.$refs.dealDialog.dialogVisible = false;
                }   
            })
        },
        delTime(data){
            // console.log("a",data)
            if(data.split('T')){
                var str = data.split('T');
                var str2 = str[1].split(".")
                var timestr = str[0] +" "+ str2[0]
                return timestr;
            }else{
                return data
            }
            
        },
    },
    beforeDestroy () {
       clearInterval(this.timeflag);
    }
}
</script>

<style lang="less">
    .supervise{
        color: white;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .toptime{
            padding: 10px;
        }
        >.el-main {
            padding: 0px 4px 10px 4px;
            overflow-x: hidden;
            height: 100%;
            .el-row{
                height: 100%;
            .el-col{
                height: 100%;
            }
            }
            .grid-content {
                height: 100%;
                .bg-purple-top-title{
                    background: #ED7D31 ;
                    box-sizing: border-box;
                    border-radius: 2px;
                    text-align: center;
                    font-size: 22px;
                    height: 4%;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .bg-content{
                    height: 96%;
                    background: #2B333F;
                    .noData{
                        text-align: center;
                        color: white;
                    }
                    .liitem{
                        padding: 10px 40px;
                        border-bottom: 1px solid;
                        .btns{
                            margin-top: 16px;
                            .el-button{
                                width: 100px;
                                &.checkbtn{
                                    background: #ED7D31;
                                    border-color: #ED7D31;
                                }
                                &.dealbtn{
                                    background: #4472C4;
                                    border-color: #4472C4;
                                }
                            }
                        }
                       
                        p{
                            line-height: 1.8;
                        }
                        .isonline{
                            width: 20px;
                            height: 20px;
                        }
                    }
                    .el-scrollbar {
                        height: 100%;
                        width: 100%;
                        .el-scrollbar__thumb{
                            background-color: rgb(255 255 255 / 30%);
                        }
                    }
                    .el-scrollbar__wrap {
                        overflow-x: hidden;
                    }
                    .el-scrollbar__view{
                        height: 100%;
                    }
                }
                &.bg-purple-right{
                    height: 50%;
                    &.top{
                        .bg-content{
                            height: 88%;
                        }
                    }
                    .bg-purple-top-title{
                        height: 8%;
                        margin-bottom:10px;
                    }
                    .bg-content{
                        height: 92%;
                    }
                }
                
            }
            
        }

        .fireBit{
          width: 100%;
          height: 500px;
          position: relative;
            .noData{
                color: white;
                font-size: 20px;
                text-align: center;
            }
          #markerLayer{
                position: relative;
                img{
                    width: 20px;
                    height: 20px;
                }
                .partlocationinfo{
                    background: #007ED8;
                    padding: 10px;
                    border-radius: 6px;
                    color: white;
                    p{
                        line-height: 1.5;
                    }
                } 
          }
        }

        .checkDialog{
          .el-form{
            padding: 0px 20px;
          }
          .partdetail{
            padding: 20px;
            .partdetail_title{
                display: inline-block;
                width: 90px;
                text-align: right;
            }
            &.top{
              border:none;
            }
            border-top: 1px solid #007ED8;
            p{
              color: white;
              line-height: 1.8;
            }
          }
        }
    }
</style>