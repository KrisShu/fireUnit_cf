<template>
  <el-container class="home">
    <el-header class="display" style="height:auto">
        <el-col :span="10">
          <div class="display header-left">
            <img class="logo_icon" src="../assets/images/home/logo.png" alt="">
            <div class="logo_tilte">
              <p class="logo_tilte_zn">城市消防物联网运营工作台</p>
              <p>Urban fire Internet of things operation workbench</p>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="display header-center">
            <img @click="unitAnalysis" src="../assets/images/home/one_icon.png" alt="">
            <img @click="operationReport" src="../assets/images/home/two_icon.png" alt="">
            <img @click="workset" src="../assets/images/home/three_icon.png" alt="">
          </div>
        </el-col>
        <el-col :span="7">
          <div class="header-right">
            <div class="header-right-set">
              <span>柳州</span>
              <img style="cursor: pointer;" @click="logout" src="../assets/images/home/top_img_04.png" alt="">
            </div>
            <p>{{mowtime}}</p>
          </div>
        </el-col>
    </el-header>
    <!--  -->
    <el-main>
      <el-row :gutter="20">
        <!-- 左侧 -->
        <el-col :span="10">
          <div class="grid-content bg-purple-left">
            <div class="bg-purple-left-top">
              <div @click="getName(arr.name,arr.type,arr.num)" v-for="(arr,index) in lefttop" :key="index">
                <p>{{arr.name}}</p>
                <p><span>{{arr.num}}</span> <span class="unit">{{arr.unit}}</span></p>
              </div>
            </div>
            <div  class="bg-purple-left-map">
              <div class="mapBoxtips">
                <p>防火单位</p>
                <p class="num">{{spots.length}}</p>
              </div>
              <div id="mapBox"></div>
            </div>
          </div>
        </el-col>
        <!-- 中间 -->
        <el-col :span="7">
          <div class="grid-content bg-purple-cneter">
            <div class="bg-purple-top-title">
              <div>{{center_title}}</div>
            </div>
            <div class="bg-purple-top-content">
                <el-scrollbar v-if="UrgeList.length>0" style="overflow: hidden;height:100%">
                  <div class="bg-purple-top-content-item" v-for="(arr,index)  in UrgeList" :key="index">
                    <p>【防火单位】{{arr.fireUnitName}}</p>
                    <p>【单位地址】{{arr.fireUnitAddress}}</p>
                    <p>【联系人】{{arr.fireUnitContractUser}} <a v-if="center_title !== '物联终端离线'" @click="urge(arr.fireUnitId,arr.operateUrgeType)" style="margin-left:70px" href="#">督促处理</a></p>
                    <p class="total">{{arr.overdueRemark}}</p>
                  </div>
                </el-scrollbar>
            </div>
          </div>
        </el-col>
        <!--右侧  -->
        <el-col :span="7">
          <div class="grid-content bg-purple-right">
            <div class="bg-purple-top-title">
              <div>督促处理</div>
            </div>
            <div v-if="ischeckinfo" class="bg-purple-top-content">
              <div class="fireInfo">
                <div class="display fireInfo_top">
                  <el-image 
                    style="width: 120px; height: 120px"
                    :src="urgeDetail.fireUnitPicture" 
                    :preview-src-list="srcList">
                  </el-image>
                  <div class="fireInfo_top_right">
                    <p>【防火单位】</p>
                    <p>{{urgeDetail.fireUnitName}}</p>
                    <p>【单位地址】</p>
                    <p>{{urgeDetail.fireUnitAddress}}</p>
                  </div>
                </div>
                <div class="fireInfo_bottom">
                  <p><span>【联系人】</span>{{urgeDetail.contractUserName}} {{urgeDetail.contractPhone}}</p>
                  <p><span>【专/兼职消防员数量】</span>{{urgeDetail.firemanNum}}</p>
                  <p><span>【消防归口】</span>{{urgeDetail.fireDeptName}}</p>
                  <p><span>【上次督促】</span>{{urgeDetail.lastUrge}}</p>
                </div>
      
              </div>
              <div class="check_fireInfo">
                <el-form ref="form" :model="urgeDetail" label-width="120px">
                  <el-form-item label="【活动名称】">
                    <p>{{right_typeName}}</p>
                  </el-form-item>
                  <el-form-item label="【督促方式】">
                    <el-radio-group @change="radiochange" v-model="urgeDetail.operateUrgeChannel">
                      <el-radio :label="1">短信</el-radio>
                      <el-radio :label="2">电话</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="urgeDetail.operateUrgeChannel == 1" label="【接收手机】">
                    <el-input v-model="urgeDetail.msgPhone"></el-input>
                  </el-form-item>
                  <el-input v-if="urgeDetail.operateUrgeChannel == 1"  rows="6" type="textarea" v-model="urgeDetail.msgContent"></el-input>

                 <div class="btnbox">
                   <el-button @click="send" type="success">发送</el-button>
                    <el-button type="info" @click="ischeckinfo = false">取消</el-button>
                 </div>
                    
                </el-form>
              </div>
            </div>
            
            <div v-else class="bg-purple-top-content">
              <div class="protect_icon_box">
                <img src="../assets/images/home/protect.png" alt="">
              </div>
              <div class="urgeToalBox">
                <div class="message">
                  <p>短信督促</p>
                  <p>今日<span class="">{{UrgeChannelNum.messageTodayNum}}</span>次</p>
                   <p>总计<span>{{UrgeChannelNum.messageTotalNum}}</span>次</p>
                </div>
                 <div class="phonecall">
                  <p>电话督促</p>
                  <p>今日<span>{{UrgeChannelNum.phonecallTodayNum}}</span>次</p>
                   <p>总计<span>{{UrgeChannelNum.phonecallTotalNum}}</span>次</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <!--  -->
    <UnitReport ref="unitReport"></UnitReport>
    <OperationReport ref="operationReport"></OperationReport>
    <WorkSet ref="workset"></WorkSet>
    <MapUnitReport ref="MapUnitReport"></MapUnitReport>
  </el-container>
</template>

<script>
import AMap from 'AMap'
import UnitReport from '../components/UnitReport.vue'
import OperationReport from '../components/OperationReport.vue'
import WorkSet from '../components/WorkSet.vue'
import MapUnitReport from '../components/MapUnitReport.vue'
// @ is an alias to /src

let moment = require('moment')
export default {
  name: 'Home',
  components:{
    UnitReport,
    OperationReport,
    WorkSet,
    MapUnitReport
  },
  data(){
    return{
      OperateCenterId:this.$store.state.userInfo.operateCenterId,
      mowtime:'',
      lefttop:[
        {
          name:'火警联网未核',
          unit:'件',
          num:0,
          type:1
        },
        {
          name:'消防设施故障',
          unit:'件',
          num:0,
          type:2
        },
        {
          name:'电气火灾隐患',
          unit:'件',
          num:0,
          type:3
        },
        {
          name:'消防通道堵塞',
          unit:'件',
          num:8,
          type:4
        },
        {
          name:'消防管网液位及水压',
          unit:'件',
          num:0,
          type:5
        },
        {
          name:'物联终端离线',
          unit:'个',
          num:0,
          type:6
        },
      ],
      center_title:'火警联网未核',//中间title文字
      urgeType:1,//
      right_typeName:'火警联网未核',//右侧活动名称
      mapObj:'',//地图对象
      UrgeList:[],
      srcList: [],
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '短信',
          desc: ''
      },
      urgeDetail:{},//督促详情
      ischeckinfo:false,
      messageBoxShow:true,//发送短信的盒子是否显示，true显示，false隐藏
      UrgeChannelNum:{
        messageTodayNum:0,
        messageTotalNum:0,
        phonecallTodayNum:0,
        phonecallTotalNum:0,
      },
      spots:'',
      infoWindow:''
      
    }
  },
  created(){
    this.currentTime();
    this.GetUrgeTypeNumList();//获取类型及数量
    this.GetUrgeList(1);
    this.GetUrgeChannelNum();
  },
  mounted(){
    this.initMap(); 
    this.makeMark();
  },
  methods:{
    getNowTime(){
      this.mowtime =  moment().format("YYYY-MM-DD HH:mm:ss")
    },
    currentTime(){
      setInterval(this.getNowTime,100)
    },
    //单位分析
    unitAnalysis(){
      this.$refs.unitReport.opendialog();
    },
    //运营报告
    operationReport(){
      this.$refs.operationReport.GetOperateReport();
    },
    //工作设置
    workset(){
      this.$refs.workset.GetSetting();
    },
    //获取类型及数量
    GetUrgeTypeNumList(){
      this.$axios.get(this.$api.GetUrgeTypeNumList,
        {params:{operateCenterId:this.$store.state.userInfo.operateCenterId}}
      ).then(res=>{
        console.log("获取数据成功",res);
        for(let i in res.result){
          this.lefttop[i].num = res.result[i].overdueNum
        }
      })
    },
    //
    getName(name,type,num){
      if(num == 0 ){
        return
      }
      console.log(name);
      this.ischeckinfo = false;
      this.center_title = name;
      this.urgeType = type;
      this.GetUrgeList(type)
    },
    //初始化地图
    initMap(){
        this.mapObj = new AMap.Map('mapBox', {
            resizeEnable: true, //自适应大小
            zoom: 9,//初始视窗
            center:[this.$store.state.userInfo.lng,this.$store.state.userInfo.lat],
            layers: [
              // 卫星
              new AMap.TileLayer.Satellite(),
              // 路网
              new AMap.TileLayer.RoadNet()
            ],
        });
        setTimeout(() => {
                this.setarea();

                // this.makeMark();
        });
    },
    //行政区规划
    setarea() {
        let that = this;
        AMap.plugin('AMap.DistrictSearch', function () {
            var districtSearch = new AMap.DistrictSearch({
                // 关键字对应的行政区级别
                level: 'city',
                //  显示下级行政区级数，1表示返回下一级行政区
                subdistrict: 1,
                // 返回行政区边界坐标等具体信息
                extensions: "all",
            })
            // 搜索所有省/直辖市信息 
            districtSearch.search('柳州', function(status, result) {
                // 查询成功时，result即为对应的行政区信息
                // console.log(result)
                // 获取相关区域的边界信息
                var bounds = result.districtList[0].boundaries
                var polygons = []
                if(bounds){
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: that.mapObj,
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.4,
                            fillColor: '#000000',
                            strokeColor: '#0000AA'
                        })
                        polygons.push(polygon)
                    }
                }
            })
        })
    },
    //地图标记点
    makeMark(){
      this.$axios.get(this.$api.GetFireUnitForMap,
        {params:{operateCenterId:this.OperateCenterId}}
      ).then(res=>{
        console.log("获取的点位",res)
        this.spots =res.result;
        let spotArray =[];
        let icon = new AMap.Icon({
          size: new AMap.Size(40, 50), // 图标尺寸
          image:
            "//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/32a60b3e7d599f983aa1a604fb640d7e.gif" // Icon的图像
        });
        for (let item of  this.spots) {
            let marker = new AMap.Marker({
                position: new AMap.LngLat(item.lng, item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: item.fireunitId,
                offset: new AMap.Pixel(-10, -10),
                icon: icon
            });
            marker.item = item; // 自定义参数
            marker.on('click',this.getMapMarkInfo)
            spotArray.push(marker);
        }
        this.mapObj.add(spotArray);
      })    
    },
    //点击地图点
    getMapMarkInfo(item){
      console.log("dianji",item);
      let Id = item ? item.target.item.fireUnitId: "";
      this.$axios.get(this.$api.GetFireUnitInfo,
        {params:{UserId:this.$store.state.userInfo.userId,Id}}
      ).then(res=>{
        console.log("防火单位res",res);
        res.result.creationTime = this.dealTime(res.result.creationTime)
        var title = res.result.name,
        content=[];
        content.push(`【具体地址】${res.result.address}`);
        content.push(`【联网时间】${res.result.creationTime}`);
        this.infoWindow = new AMap.InfoWindow({  
            isCustom: true,  //使用自定义窗体
            content: this.createInfoWindow(title, content.join("<br/>"),res.result.id),
            offset: new AMap.Pixel(16, -45)
        }); 
        this.infoWindow.open(this.mapObj, [item.target.item.lng,item.target.item.lat]);
      })
    },
    createInfoWindow(title, content,fID) {
            var info = document.createElement("div");
            info.className = "custom-info input-card content-window-card";

            //可以通过下面的方式修改自定义窗体的宽高
            //info.style.width = "400px";
            // 定义顶部标题
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("img");
            top.className = "info-top";
            titleD.innerHTML = title;
            closeX.src = "https://webapi.amap.com/images/close2.gif";
            closeX.onclick = this.closeInfoWindow;

            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);

            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.style.backgroundColor = 'white';
            middle.innerHTML = content;

            let reportDiv = document.createElement('div')
            reportDiv.innerText = '智慧消防数据综合报告';
            reportDiv.style.textAlign="center"
            reportDiv.style.color="rgb(91, 183, 245)"
            reportDiv.style.cursor="pointer"
            reportDiv.style.textDecoration = 'line'
            reportDiv.style.borderBottom = '1px solid rgb(91, 183, 245)'
            reportDiv.onclick=()=>{
                this.openReportDialog(fID)
            }
            middle.appendChild(reportDiv)
            info.appendChild(middle);

            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0 auto';
            var sharp = document.createElement("img");
            sharp.src = "https://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
    },
    //关闭弹窗
    closeInfoWindow() {
            // console.log("关闭")
            this.infoWindow.close();
    },
    openReportDialog(fID){
      this.$refs.MapUnitReport.perWeek(fID)
    },
    dealTime(data){
        var str = data.split('T');
        var str2 = str[1].split(".")
        var timestr = str[0] +" "+ str2[0]
        return timestr;
    },
    //获取督促处理列表
    GetUrgeList(type){
      this.$axios.get(this.$api.GetUrgeList,
        {params:{OperateUrgeType:type,OperateCenterId:this.OperateCenterId }}
      ).then(res=>{
        console.log("获取督促处理列表",res)
        this.UrgeList = res.result
      })
    },
    //督促点击
    urge(id,type){
      this.right_typeName = this.center_title;
      this.ischeckinfo = true;
      this.$axios.get(this.$api.GetUrgeDetail,
        {params:{OperateCenterId:this.OperateCenterId,FireUnitId :id,OperateUrgeType :type}}
      ).then(res=>{
        console.log("获取详情",res)
        this.srcList =[]
        this.srcList.push(res.result.fireUnitPicture)
        this.urgeDetail = res.result;
        this.$set(this.urgeDetail, 'operateUrgeChannel', 1)
        this.$set(this.urgeDetail, 'msgPhone', res.result.contractPhone)
      })
    },
    //radio选择
    radiochange(index){
      console.log("radiochange",index)
      if(index == '电话'){
        this.messageBoxShow = false;
      }else{
        this.messageBoxShow = true;
      }
    },
    //提交督促处理
    send(){
      let SubmitUrgeForm = {};
      SubmitUrgeForm.fireUnitId = this.urgeDetail.fireUnitId
      SubmitUrgeForm.operateUrgeChannel = this.urgeDetail.operateUrgeChannel
      SubmitUrgeForm.operateCenterUserId = this.$store.state.userInfo.userId
      SubmitUrgeForm.operateCenterId = this.OperateCenterId
      SubmitUrgeForm.msgPhone = this.urgeDetail.msgPhone
      SubmitUrgeForm.msgContent = this.urgeDetail.msgContent
      this.$axios.post(this.$api.SubmitUrge,SubmitUrgeForm).then(res=>{
        console.log("提交督促处理",res)
        this.$message({
          message: '发送成功',
          type: 'success'
        });
        setTimeout(()=>{
          this.ischeckinfo = false;
        },1000)
        
        this.GetUrgeList(this.urgeType)
        this.GetUrgeChannelNum();
      }).catch(err=>{
        console.log("提交督促处理失败",err)
        this.$message.error(err.error.message);
      })
    },
    //获取督促方式的次数统计
    GetUrgeChannelNum(){
      this.$axios.get(this.$api.GetUrgeChannelNum,
        {params:{operateCenterId:this.OperateCenterId}}
      ).then(res=>{
        console.log("获取督促方式的次数统计",res)
        this.UrgeChannelNum.messageTodayNum = res.result[0].todayNum
        this.UrgeChannelNum.messageTotalNum = res.result[0].totalNum
        this.UrgeChannelNum.phonecallTodayNum = res.result[1].todayNum
        this.UrgeChannelNum.phonecallTotalNum = res.result[1].totalNum
      })
    },
    //退出登录
    logout(){
      this.$confirm('确定注销登录?', '注销登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          
          this.$axios.post(this.$api.UserLogout).then(res=>{
            console.log("注销成功",res);
            localStorage.clear();
            this.$router.push('/login')
            this.$message({
              type: 'success',
              message: '注销成功!'
            });
          })
      }).catch(() => {       
      });
    }
  }
}
</script>

<style lang="less">
@bgcolor:#181717;
.home{
  height: 100vh;
  width: 100%;
  background: @bgcolor;
  color: white;

  .display{
    display: flex;
    align-items: center;
  }
  .display_cloumn{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .el-header{
    padding: 10px 4px;
    .header-left{
      .logo_icon{
        width: 60px;
        margin-right: 20px;
      }
      .logo_tilte{
        font-size: 16px;
        line-height: 1.5;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        .logo_tilte_zn{
          font-size: 26px;
        }
      }
    }
    .header-center{
      justify-content: space-around;
      img{
        width: 80px;
        cursor: pointer;
      }
    }
    .header-right{
      text-align: right;
      line-height: 2;
      &-set{
        padding-right: 90px;
        img{
          margin-left: 10px;
        }
      }
    }

  }
  .el-main {
    padding: 0px 4px 10px 4px;
    overflow-x: hidden;
    .el-row{
      height: 100%;
      .el-col{
        height: 100%;
      }
    }
    .grid-content {
      border-top-width: 4px;
      border-top-style: solid;
      box-sizing: border-box;
    }
    //-------------------------------------------------
    .bg-purple-left{
      height: 100%;
      border-top-color: #60A4E2;
      .bg-purple-left-top{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        height: 20%;
        div{
          width: 32%;
          height: 45%;
          background: #BA8E07;
          box-sizing: border-box;
          padding: 10px;
          padding-left: 24px;
          font-size: 18px;
          line-height: 1.5;
          cursor: pointer;
          span{
            font-size: 28px;
            font-weight: bold;
            margin-right: 10px;
            &.unit{
              font-size: 14px;
              font-weight: normal;
            }
          }
          &:nth-child(odd){
            background: #AD5F29;
          }
        }
      }
      .bg-purple-left-map{
        border-image: url("../assets/images/home/mapBoeder.png") 32 37 repeat stretch;
        border-style: solid;
        border-width: 10px 10px;
        height: 80%;
        box-sizing: border-box;
        position: relative;
        .mapBoxtips{
          position: absolute;
          z-index: 11;
          background: rgba(0, 0, 0, .5);
          border-radius: 10px;
          padding: 10px 20px;
          bottom: 20px;
          left: 20px;
          text-align: center;
          line-height: 1.5;
          .num{
            font-size: 20px;
          }
        }
        #mapBox{
          height: 100%;
        }
        .amap-info{
              .content-window-card {
                  position: relative;
                  box-shadow: none;
                  bottom: -20px;
                  left: 0;
                  width: auto;
                  padding: 0;
                  p {
                      height: 2rem;
                  }
                  div.info-top {
                      position: relative;
                      background: none repeat scroll 0 0 #F9F9F9;
                      border-bottom: 1px solid #CCC;
                      text-align: center;
                      // border-radius: 5px 5px 0 0;
                      div {
                          display: inline-block;
                          // color: #00c3ff;
                          color: #333;
                          font-size: 14px;
                          text-align: center;
                          font-weight: bold;
                          line-height: 31px;
                          padding: 0 24px;
                      }
                      img {
                          position: absolute;
                          top: 10px;
                          right: 4px;
                          transition-duration: 0.25s;
                          &:hover {
                              box-shadow: 0px 0px 5px rgb(128, 68, 68);
                          }
                      }
                  }
                  div.info-middle {
                      font-size: 14px;
                      padding: 10px 6px;
                      line-height: 20px;
                      color: rgb(112, 112, 121);
                  }
                    div.info-bottom {
                      height: 0px;
                      width: 100%;
                      clear: both;
                      text-align: center;
                      img {
                          position: relative;
                          z-index: 104;
                      }
                  }
                  
              }
              .custom-info {
                      border: solid 1px rgb(179, 168, 168);
              }
        }
        
      }
    }
    //--------------------------------------------------
    .bg-purple-cneter{
      height: 100%;
      background: saddlebrown;
      border-top-color: #EC7C30;
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
      .bg-purple-top-content-item{
        padding: 10px;
        font-size: 18px;
        line-height: 1.8;
        border-bottom: 1px solid #906B52;
        p{
          a{
            color: #6EA5DF;
          }
        }
        .total{
          background: #DAE3F3;
          color: #232323;
          padding-left: 10px;
          margin: 6px 0;
          border: 1px solid #878EA3;
        }
      }
      
      .nodata{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        img{
          width: 200px;
        }
      }
    }
    //--------------------------------------------------
    .bg-purple-right{
      height: 100%;
      border-top-color: #73B349;
      display: flex;
      flex-direction: column;
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
      .fireInfo{
        padding: 20px;
        font-size: 18px;
        border-bottom: 1px solid #906B52;
        .fireInfo_top{
          margin-bottom: 20px;
          .fireInfo_top_right{
            margin-left: 20px;
            line-height: 2;
          }
        }
        .fireInfo_bottom{
          line-height: 2;
        }
      }
      .check_fireInfo{
        padding: 20px;
        .el-form{
          .el-form-item{
            margin-bottom: 18px;
            &:nth-last-of-type(1){
              margin: 0;
              margin-top: 18px;
            }
            .el-form-item__label{
              font-size: 18px;
              color: white;
            }
            .el-form-item__content{
              font-size: 18px;
              color: white;
              &:nth-last-of-type{
                margin: 0 !important;
              }
              .el-radio{
                .el-radio__inner{
                  width: 18px;
                  height: 18px;
                }
                .el-radio__label{
                  font-size: 18px;
                  color: white;
                }
              }
              .el-input{
                .el-input__inner{
                  background: none;
                  border-color: #906B52;
                  color: white;
                }
              }
            }
          }
          .el-textarea__inner{
              background: none !important;
              border-color: #906B52;
              resize: none;
              color: white;
          }
          .btnbox{
            margin-top: 18px;
            .el-button{
              width: 49%;
            }
          }
          
        }
      }
      .protect_icon_box{
        border-bottom: 1px solid #906B52;
        height: 50%;
        text-align: center;
        img{
          height: 100%;
        }
      }
      .urgeToalBox{
        padding: 20px;
        display: flex;
        height: 50%;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div{
          width: 80%;
          color: white;
          line-height: 1.5;
          padding: 10px;
          span{
            font-size: 28px;
            margin: 0 10px;
          }
          &.message{
            background: #0D8BBB;
            margin-bottom: 10px;
          }
          &.phonecall{
            background: #0D5E9A;
            margin-bottom: 10px;
          }
        }
      }
    }
    .bg-purple-top-title{
        background:@bgcolor;
        box-sizing: border-box;
        padding: 10px 0px;
        line-height: 46px;
        border-radius: 2px;
        text-align: center;
        font-size: 22px;
        height: 8%;
        div{
          background: #2B333F;
        }
    }
    .bg-purple-top-content{
      height: 92%;
      background: #2B333F;
      overflow: hidden;
      .el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
   
  }
  

}
</style>
