<template>
    <el-dialog
        title="趋势"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
    >
    <div class="trendDialog">
        <!--  -->
        <div class="trendDialog_top">
          <span v-if="monitorItemName != 'L'" class="trendDialog_top_left">监测指标：{{monitorItemName}}</span>
          <div v-else class="trendDialog_top_left">
            <span>监测指标：</span>
             <el-select @change="selectchange" v-model="trendvalue">
              <el-option label="L" value="L"> </el-option>
              <el-option label="N" value="N"> </el-option>
            </el-select>
          </div>
          <div class="trendDialog_top_right">
            <span class="demonstration">日期范围：</span>
            <el-date-picker
              v-model="trend_date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button style="marginLeft:20px" @click="selectadtetrend">查询</el-button>
          </div>
        </div>
        <!--  -->
        <el-row v-if="trendData.length>0">
          <el-col :span="7">
            <el-scrollbar style="height:400px">
              <div class="left_list">
                <p v-for="(item,index) in trendData" :key="index">
                  <span class="time">{{item.time}}</span>
                  <span class="gap">-</span>
                  <span class="green" v-if="item.value < trendData_max*0.8" >{{item.value}} {{trendUnit}}</span>
                  <span class="orange" v-if="item.value < trendData_max && item.value>=trendData_max*0.8" >{{item.value}} {{trendUnit}}</span>
                  <span class="red" v-if="item.value >= trendData_max" >{{item.value}}{{trendUnit}}</span>
                </p>
              </div>
             </el-scrollbar>
          </el-col>
          <el-col :span="17">
            <div id="trendEcharts"></div>
          </el-col>
        </el-row>
        <el-row class="nodata" v-else>
        <!--   <img src="../../../assets/image/index/nodata.png" alt=""> -->
          <p>您选择的日期范围内暂无记录数据</p>
        </el-row>
      </div>
    </el-dialog>
</template>

<script>
let moment = require('moment');
export default {
    data(){
        return{
            detectorId:'',//
            dialogVisible:false,
            monitorItemName:'',
            monitorItemFlag:'',
            trendvalue:'L',
            trendData:[],
            trendUnit:'',
            trendData_min:'',
            trendData_max:'',
            trend_date:[],
        }
    },
    methods:{
         //关闭弹出
        handleClose(){
            this.dialogVisible =false
        },
        selectchange(){
          this.monitorItemFlag = this.trendvalue
        },
        selectadtetrend(){
          this.gettrendData();
        },
        //获取趋势数据
        gettrendData(){
          this.$axios.get(this.$api.GetRecordTrend,
            {params:{DetectorId:this.detectorId,Sign:this.monitorItemFlag,Start:this.trend_date[0],End:this.trend_date[1]}}
          ).then(res=>{
            // console.log(res);
            if(res.result.lstAnalogData){
                  this.trendData = res.result.lstAnalogData
                  this.trendUnit = res.result.unit
                  this.trendData_max = res.result.max
                  this.trendData_min = res.result.min
                  
                  let timevalue = []
                  let datavalue = []
                  for(let arr of this.trendData){
                    arr.time = this.dealTime(arr.time)
                    timevalue.push(arr.time)
                    datavalue.push(arr.value)
                  } 
                  //数据反转
                  timevalue.reverse()
                  datavalue.reverse()
                  if( this.trendData.length>0){
                      this.$nextTick(()=>{
                        this.initEcharts(timevalue,datavalue)
                      })
                  }
            }
          })
        },
         //处理时间格式
    dealTime(data){
      var str = data.split('T');
      var str2 = str[1].split(".")
      var timestr = str[0] +" "+ str2[0]
      return timestr;
    },
    //Echarts图
    initEcharts(timevalue,datavalue){
      let trendEcharts = this.$echarts.init(document.getElementById('trendEcharts'));
      trendEcharts.setOption({
        legend:{
          top:'top'
        },
        grid:{
           top:'20'
        },
        
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    color: '#222'
                }
            }
        },
        xAxis: {//x轴
            type: 'category',
            data: timevalue,
            axisLabel:{
             
              showMaxLabel: true,//是否显示最大 tick 的 label。
              showMinLabel: true,//是否显示最小 tick 的 label。
              formatter:function(value,idx){//坐标文字处理现实
                 var str = value.split(" ");
                 var addstr ="";
                 addstr = str[0]+"\n"+str[1]  
                 return addstr
              }
            },
            axisTick: {
              alignWithLabel: true,
            },
            axisLine:{//设置轴线的属性
                  lineStyle:{
                      color:'white',
                      width:4,//这里是为了突出显示加上的
                  }
            } 
        },
        yAxis: {
            type: 'value',
            axisLine:{
                lineStyle:{
                    color:'white',
                    width:4,//这里是为了突出显示加上的
                }
            } 

        },
         dataZoom: [
            {
                startValue: timevalue[0],
                endValue:timevalue[timevalue.length-1],
                left:"center",                           
                right:"auto",
                bottom:"0",     
            },
            {
              type: 'inside'
            }
        ],
        series: [{
            data:datavalue,
            type: 'line',
            // symbol:'none',
            showSymbol: false,
            lineStyle:{
              color:"red"
            }
        }]

      });
    },

    }
}
</script>

<style lang="less">
    .trendDialog{
      width: 100%;
      height: 500px;
      .green{
        color: rgb(1, 160, 1);
      }
      .orange{
        color: orangered;
      }
      .red{
        color: red;
      }
      .trendDialog_top{
        display: flex;
        color: white;
        margin-bottom: 20px;
        .trendDialog_top_left{
          display: flex;
          align-items: center;
          .el-select{
            width: 80px;
            input{
               background: #025691;
               color: white;
               font-weight: bold;
            }
          }
        }
        .trendDialog_top_right{
          margin-left: 160px;
        }
        .el-button{
          background: #025691;
          width: 130px;
          color: #fff;
        }
        .el-date-editor{
          background: #025691;
          .el-range-input{
             background: #025691;
             color: white;
          }
        }
      }
      .timeRange{
        color: white;
        text-align:center;
        font-weight: bold;
        margin-top: 20px;
      }
      .left_list{
        width: 100%;
        p{
          line-height: 2;
          color: white;
          .gap{
            display: inline-block;
            margin:0px 8px;
          }
          
        }
      }
      .el-scrollbar__wrap{
        overflow-x: hidden;
      }
      #trendEcharts{
        width: 100%;
        height:400px;
      }
      .nodata{
        display: flex;
        align-items: center;
        flex-direction: column;
        color: white;
        margin-top: 50px;
      }

    }
</style>