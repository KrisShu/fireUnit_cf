<template>
  <div class="network">
      <baseSelect @select="select"></baseSelect>
      <baseTable 
        :columnList='columnList' 
        :tableData ='tableData'
        tableName='network'
        @getlocation="getlocation"
        @check="check"
      ></baseTable>
      <basePage :propPage="page" @currentChange="GetAlarmList"></basePage>

      <!-- 定位弹窗 -->
      <basedialogMark ref="locationDialog" :detectordetail="detectordetail"></basedialogMark>

      <!-- 核警 -->
      <basedialog :footershow="footershow"  @submit="checkSubmit"  width="30%" title="警情核警" ref="checkDialog">
            <div class="checkDialog">
              <el-form  v-if="footershow" ref="form" :model="checkForm" label-width="82px">
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
              <div class="partdetail top" v-else>
                  <p>
                    <span class="partdetail_title">核警时间：</span>
                    <span>{{checkdetail.checkTime}}</span>
                  </p>
                  <p>
                    <span class="partdetail_title">核警状态：</span>
                    <span v-if="checkdetail.checkState == 2">误报</span>
                    <span v-if="checkdetail.checkState == 3">测试</span>
                    <span v-if="checkdetail.checkState == 4">真实</span>
                  </p>
                  <p>
                    <span class="partdetail_title">核警说明：</span>
                    <span>{{checkdetail.checkRemark}}</span>
                  </p>
              </div>
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


  </div>
</template>

<script>
export default {
  data(){
    return{
      columnList:[
        {
          prop:'creationTime',
          label:'事件时间'
        },
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
          prop:'architectureName',
          label:'建筑'
        },
        {
          prop:'floorName',
          label:'楼层'
        },
        {
          prop:'location',
          label:'位置'
        },
        {
          prop:'value',
          label:'数值'
        },
        {
          prop:'checkState',
          label:'核警状态'
        },
        {
          label:'操作'
        },
      ],
      tableData:[],
      page:{
        ArchitectureId :'',
        DetectorSn:'',
        CheckState:0,
        SkipCount:0,
        MaxResultCount:10,
        total:0
      },//请求列表参数
      detectordetail:{},//某一条的具体详情
      partdetails:{},//某一条的具体详情
      footershow:true,//警情核警是否显示foot按钮
      checkdetail:{},//某一条的核警说明
      checkForm:{
        alarmId:'',//alarmId
        userId:this.$store.state.userInfo.userId,//当前登录人员Id
        checkState:2,
        checkRemark:'',

      },//核警数据
    }
  },
  created(){
    this.GetAlarmList();
  },
  methods:{
    //获取所有列表
    GetAlarmList(){
      this.$axios.get(this.$api.GetAlarmList,{params:this.page}).then(res=>{
        // for(let arr of res.result.items){
        //   arr.creationTime = this.delTime( arr.creationTime)
        // };
        ({items:this.tableData,totalCount:this.page.total}=res.result)
      })
    },
    //顶部筛选
    select(data){
      // console.log("筛选",data);
      this.page.ArchitectureId = data.ArchitectureId
      this.page.DetectorSn = data.DetectorSn
      this.page.CheckState = data.CheckState
      this.GetAlarmList();
    },
    //获取某一条的具体信息
     GetDetectorInfo(detectorId){
        return new Promise((resolve)=> {
          this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId}}).then(res=>{
            // console.log("获取某一条的具体信息",res);
            this.partdetails = res.result;
            if( this.partdetails.coordinatePicture){
              this.partdetails.coordinatePicture = `${this.$URL}${this.partdetails.coordinatePicture}`
            }
             resolve(this.partdetails);
          })
        })
    },
    //打开定位弹窗
    getlocation(rowdata){
      this.$refs.locationDialog.dialogVisible  = true;
      this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId:rowdata.detectorId}}).then(res=>{
          // console.log("获取某一条的具体信息",res);
          this.detectordetail = res.result;
          if( this.detectordetail.coordinatePicture){
              this.detectordetail.coordinatePicture = `${this.$URL}${this.detectordetail.coordinatePicture}`
              this.$nextTick(()=>{
                  this.$refs.locationDialog.init();
                  this.$refs.locationDialog.createMarker(this.detectordetail)
              })
            } 
      })
    },
    //打开核警弹窗
    check(rowdata){
      this.$refs.checkDialog.dialogVisible = true;
      this.checkForm.alarmId = rowdata.alarmId;
      if(rowdata.checkState == 1){
        this.footershow = true
      }else{
        this.footershow = false
      }
      this.GetAlarmCheckInfo(rowdata.alarmId)
    },
    //获取核警说明
    GetAlarmCheckInfo(alarmId){
      this.$axios.get(this.$api.GetAlarmCheckInfo,{params:{alarmId}}).then(res=>{
        res.result.creationTime = this.delTime(res.result.creationTime)
        res.result.checkTime = this.delTime(res.result.checkTime)
        this.checkdetail = res.result;
      })
    },
    //核警提交
    checkSubmit(){
        // console.log(this.checkForm)
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
    delTime(data){
        var str = data.split('T');
        var str2 = str[1].split(".")
        var timestr = str[0] +" "+ str2[0]
        return timestr;
    },
  }
}

</script>

<style lang="less">
    .network{
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
                p{
                  line-height: 1.5;
                }
                  background: #007ED8;
                  padding: 10px;
                  border-radius: 6px;
                  color: white;

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
                .partdetail_title{
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                } 
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