<template>
  <div class="Inhalation_gateway">
      <basescreenbtnAdd 
        :top_screen_btn="top_screen_btn"
        @add='add'
        @topScreen="topScreen"
      ></basescreenbtnAdd>
      <baseTable 
        :columnList='columnList' 
        :tableData ='tableData'
        tableName='gateway'
        @getdetails="getdetails"
        @getfault="getfault"
        @getnetworkList="getnetworkList"
        @deleteData="deleteData"
      ></baseTable>
      <basePage :propPage="page" @currentChange="GetGatewayList"></basePage>
      <!-- 新增和详情的弹窗 -->
      <basedialog :footershow="true" @submit="submit" title="电气火灾网关维护" ref="add_detailDialog">
        <el-form :model="add_detailForm"   :rules="rules" ref="add_detailForm" label-width="100px" class="add_detailForm">
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
              <el-select v-model="add_detailForm.architectureId" placeholder="请选择活动区域">
                <el-option 
                v-for="(arr,index) in ArchitectureList" 
                :key="index" 
                :label="arr.name" 
                :value="arr.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="安装位置：" prop="address">
              <el-input v-model="add_detailForm.address"></el-input>
            </el-form-item>
            <el-form-item label="温度范围：" prop="address">
              <div class="display_input">
                <el-input v-model="add_detailForm.minTemperature">
                    <template slot="append">℃</template>
                </el-input>
                ——
                <el-input v-model="add_detailForm.maxTemperature">
                   <template slot="append">℃</template>
                </el-input>
              </div>
             
            </el-form-item>
            <el-form-item label="剩余电流：" prop="address">
              <div class="display_input">
                <el-input v-model="add_detailForm.minA">
                    <template slot="append">mA</template>
                </el-input>
                ——
                <el-input v-model="add_detailForm.maxA">
                   <template slot="append">mA</template>
                </el-input>
              </div>
            </el-form-item>
        </el-form>
      </basedialog>
      <!-- 故障部件弹窗 -->
      <basedialog width="50%" ref="faultListDialog" title="故障部件">
          <div class="network_parts_title">
            网关编号：{{network_parts.gatewaySn}}，
            建筑：{{network_parts.architectureName}}
          </div>
        <baseTable 
        
          :columnList='columnList_parts_fault'
          :tableData ='tableData_parts'
          tableName='infomations'
          @getlocation="getlocation"
          >
        </baseTable>
          <basePage :propPage="page_parts" @currentChange="GetDetectorListByGateway"></basePage>
      </basedialog>
      <!-- 联网部件弹窗 -->
      <basedialog width="50%" ref="networkListDialog" title="联网部件">
        <div class="network_parts_title">
          网关编号：{{network_parts.gatewaySn}}，
          建筑：{{network_parts.architectureName}}
        </div>
        <baseTable 
        :columnList='columnList_parts'
        :tableData ='tableData_parts'
        @showtrend="showtrend"
        >
        </baseTable>
      </basedialog>
      <!-- 定位 -->
      <basedialogMark ref="locationDialog" :detectordetail="detectordetail"></basedialogMark>
  
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
          text:'在线',
          class:'green',
          num:0
        },
        {
          text:'离线',
          class:'gary',
          num:0
        }
      ],
      columnList:[
        {
          prop:'gatewaySn',
          label:'网关编号'
        },
        {
          prop:'brand',
          label:'品牌'
        },
        {
          prop:'model',
          label:'型号'
        },
        {
          prop:'architectureName',
          label:'管理建筑'
        },
        {
          prop:'address',
          label:'安装位置'
        },
        {
          prop:'gatewayStatus',
          label:'状态'
        },
        {
          prop:'faultDetectorNum',
          label:'故障部件'
        },
        {
          label:'操作'
        },
      ],
      tableData:[],
      page:{
        FireUnitId:this.$store.state.userInfo.fireUnitID,
        SysType:3,//
        GatewayStatus:0,//网关状态
        SkipCount:0,
        total:0,
        MaxResultCount:10
      },//联网设备请求列表参数
      add_detailForm:{
        fireUnitId:this.$store.state.userInfo.fireUnitID,
        sysType:3,
        gatewaySn:'',//设备编号
        architectureId:'',//所在建筑id
        brand:'',//品牌
        model:'',//型号
        address:'',//安装位置
        minTemperature:0,
        maxTemperature:60,
        minA:0,
        maxA:300
      },
      rules: {
          gatewaySn: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          architectureId: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
      },
      ArchitectureList:[],//下拉选择的建筑列表
      network_parts:{},//联网部件具体信息
      page_parts:{
        GatewayId:0,
        State:0,//状态，默认全部
        SkipCount:0,
        total:0,
        current:1,
        MaxResultCount:6,
      },//火警联网部件的列表请求参数
      columnList_parts:[
        {
          label:'部件编号',
          prop:'detectorSn'
        },
        {
          label:'部件类型',
          prop:'detectorType'
        },
        {
          label:'具体位置',
          prop:'location'
        },
        {
          label:'监测值',
          prop:'detectorValue'
        },
        {
          label:'趋势',
        }
      ],
      columnList_parts_fault:[
        {
          label:'部件编号',
          prop:'detectorSn'
        },
        {
          label:'部件类型',
          prop:'detectorType'
        },
        {
          label:'具体位置',
          prop:'location'
        },
        {
          label:'故障类型',
          prop:'location'
        },
        {
          label:'操作',
        },
      ],
      tableData_parts:[],
      detectordetail:{},
    }
  },
  created(){
    this.GetArchitectureList();
    this.GetGatewayList();
    this.GetGatewayStatusNum();//获取状态数量
  },
  methods:{
    //获取建筑下拉列表
    GetArchitectureList(){
      this.$axios.get(this.$api.GetArchitectureList,{params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}).then(res=>{
        // console.log("获取建筑下拉列表",res)
        this.ArchitectureList = res.result
      })
    },
    //获取状态数量
    GetGatewayStatusNum(){
      this.$axios.get(this.$api.GetGatewayStatusNum,{params:this.page}).then(res=>{
        // console.log(res)
        this.top_screen_btn[1].num = res.result[0].value
        this.top_screen_btn[2].num = res.result[1].value
      })
    },
    //获取联网设备列表
    GetGatewayList(){
      this.$axios.get(this.$api.GetGatewayList,{params:this.page}).then(res=>{
        // console.log("获取联网设备列表",res);
        ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },
    //顶部筛选
    topScreen(text){
      // console.log("topScreen",text)
      if(text == '全部'){
        this.page.GatewayStatus = 0
      }else if(text == '在线'){
        this.page.GatewayStatus = 1
      }else if(text == '离线'){
        this.page.GatewayStatus = -1
      }
      this.GetGatewayList();
    },
    // 新增
    add(){
      this.$refs.add_detailDialog.dialogVisible  = true
      this.$nextTick(()=>{
        this.$refs.add_detailForm.resetFields();
      })
       this.add_detailForm.gatewayId = ''
       this.add_detailForm.fireUnitId = this.$store.state.userInfo.fireUnitID
       this.add_detailForm.sysType = 3 
       this.add_detailForm.minTemperature = 0 
       this.add_detailForm.maxTemperature = 60
       this.add_detailForm.minA = 0
       this.add_detailForm.maxA = 300
    },
    //新增个修改提交
    submit(){
        this.$refs.add_detailForm.validate((valid) => {
            if(valid){
                // console.log(this.add_detailForm);
                let axios = this.add_detailForm.gatewayId ? this.$axios.put(this.$api.UpdateGateway,this.add_detailForm) :
                this.$axios.post(this.$api.AddGateway,this.add_detailForm);
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
                  this.GetGatewayList();
                  this.GetGatewayStatusNum();
                }).catch(err=>{
                    this.$message({
                        message:err.data.error.message,
                        type: 'error'
                    });
                })
            }
        })
    },
    //打开详情弹窗
    getdetails(rowdata){
      this.$refs.add_detailDialog.dialogVisible  = true
      this.GetGatewayInfo(rowdata.gatewayId)
    },
    //获取某个设备的详情
    GetGatewayInfo(gatewayId){
      this.$axios.get(this.$api.GetGatewayInfo,{params:{gatewayId}}).then(res=>{
        // console.log('获取某个设备的详情',res)
        this.add_detailForm = res.result
      })
    },
    //打开故障部件
    getfault(rowdata){
      this.$refs.faultListDialog.dialogVisible  = true
      this.network_parts = rowdata
      this.page_parts.SkipCount =0;
      this.page_parts.current = 1;
      this.page_parts.GatewayId = rowdata.gatewayId
      this.page_parts.State = 2
      this.GetDetectorListByGateway();

    },
    //打开联网部件弹窗
    getnetworkList(rowdata){
      // console.log(rowdata)
      this.network_parts = rowdata
      this.$refs.networkListDialog.dialogVisible  = true
      this.page_parts.SkipCount =0;
      this.page_parts.current = 1;
      this.page_parts.GatewayId = rowdata.gatewayId
      this.page_parts.State = 0
      this.GetDetectorListByGateway();
    },
    //获取火警联网部件列表
    GetDetectorListByGateway(){
      this.$axios.get(this.$api.GetDetectorListByGateway,{params:this.page_parts}).then(res=>{
        // console.log("获取火警联网部件列表",res);
        ({items: this.tableData_parts,totalCount: this.page_parts.total} = res.result);
      })
    },  
    //查看趋势
    showtrend(item){
      console.log(item)
      this.$refs.baseTrend.dialogVisible = true;
      this.$refs.baseTrend.detectorId = item.detectorId;
     
      this.$refs.baseTrend.trend_date =[];
      this.$refs.baseTrend.trend_date[0] = moment().subtract(1,'months').format('YYYY-MM-DD')
      this.$refs.baseTrend.trend_date[1] = moment().format('YYYY-MM-DD')

      if(item.detectorType == '温度传感器'){
        this.$refs.baseTrend.monitorItemName = 'L'
        this.$refs.baseTrend.monitorItemFlag = 'L'
      }else if(item.detectorType == "剩余电流传感器"){
        this.$refs.baseTrend.monitorItemName = '剩余电流'
        this.$refs.baseTrend.monitorItemFlag = 'A'
      }
      this.$refs.baseTrend.gettrendData();
      

    },
    //删除数据
    deleteData(rowdata){
      // console.log(rowdata)
      this.$axios.delete(this.$api.DeleteGateway,{params:{gatewayId:rowdata.gatewayId}}).then(()=>{
        // console.log("删除数据",res)
          this.$message({
            message:'删除数据成功',
            type: 'success'
          });
          this.GetGatewayList();
          this.GetGatewayStatusNum();
      })
    },
     //故障部件列表打开定位弹窗
    getlocation(rowdata){
      this.$refs.locationDialog.dialogVisible  = true;
      this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId:rowdata.detectorId}}).then(res=>{
        if(res.result.coordinatePicture){
            this.detectordetail = res.result;
            if( this.detectordetail.coordinatePicture){
              this.detectordetail.coordinatePicture = `${this.$URL}${this.detectordetail.coordinatePicture}`
             this.$nextTick(()=>{
                this.$refs.locationDialog.init();
                this.$refs.locationDialog.createMarker(this.detectordetail)
             })
            } 
        }
      })
    }
  }
}
</script>

<style lang="less">
  .Inhalation_gateway{
    height: 100%;
    display: flex;
    flex-direction: column;
    &>:nth-child(2){
        flex: 2 0 auto;
    }
    .add_detailForm{
      .chuankou{
        .el-form-item__content{
          display: flex;
          .select_div{
            &>span{
              margin-right: 6px;
              color: white;
            }
            .el-select{
              width: 78%;
            }
          }
         
        }
      
      }
      .display_input{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-input-group{
              width: 45%;
            }
      }
    }

    .network_parts_title{
      color: white;
      margin-bottom: 10px;
    }
    
  }
</style>