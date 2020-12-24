<template>
  <div class="fireAlarmLocationBox">
      <div class="left">
          <el-scrollbar style="height:100%">
          <div class="left_top">
              <p>楼层：{{address}}</p>
              <el-button v-if="ismark"  @click="stopmark" type="danger">结束标记</el-button>
              <el-button v-else  @click="startmark" type="primary">开始标记点位</el-button>
          </div>
          <baseTable
            :columnList="tableThead"
            :tableData="tableData"
            :specailText="specailText"
            tableName='makemark'
            @makemark="getmakemark"
          >
          </baseTable>
          </el-scrollbar>
      </div>

      <div class="right">
        <div ref="dv" class="img" id="dv" >
          
        </div>
      </div>

    
  </div>
</template>

<script>
import AILabel  from 'ailabel'
export default {
    data(){
        return{
            address:'',
            floor_Picture:"",
            iscloummark:false,//一行的
            ismark:false,//是否开始标记，true才能标记，false查看
            imgmark1:false,
            clounmIndex:0,
            specailText:"查看",
            tableThead:[
                {
                    label:'部件编号',
                    prop:'detectorSn',
                },
                {
                    label:'部件类型',
                    prop:'detectorType',
                },
                {
                    label:'安装位置',
                    prop:'location',
                },
                {
                    label:'坐标',
                    prop:'coordinateX',
                    prop1:'coordinateY',
                },
                {
                    label:'操作'
                }
            ],
            tableData:[],
            totalCount:0,
            floorId:'',
            gFeatureLayer:'',
            gMap:'',
            havepoints:'',
            fea:'',
            markerArr:[],
            clounmMark:'',//
            pinkDian:require('../../../assets/images/dian.png'),
            greenDian:require('../../../assets/images/green.png'),
            redDian:require('../../../assets/images/dian_active.png'),
        }
    },
    created(){
      
      this.floorId = this.$route.query.floor_id
     
    },
    mounted(){
      this.GetBitMapSet();
      
    },
    methods:{
      //获取列表内容
      GetBitMapSet(){
        this.$axios.get(this.$api.GetBitMapSet,{params:{floorId:this.floorId}}).then(res=>{
          console.log("res",res)
          this.address = res.result.architectureName+res.result.floorName
          this.floor_Picture = `${this.$URL}${res.result.floor_Picture}`
          this.tableData = res.result.bitMapSetDetectorList
         
          this.init();
          this.getallmark();
        }).catch(err=>{
          console.log("err",err)
        })
      },
      //初始化
      init(){
         this.gMap = new AILabel.Map('dv',
          {
            zoom: 1080, 
            cx: 0, 
            cy: 0, 
            zoomMax: 650 * 10, 
            zoomMin: 650 / 10, 
            autoPan: true, 
            drawZoom: true
          }
        );
        // 图片层实例\添加
        const gImageLayer = new AILabel.Layer.Image('img', this.floor_Picture, 
          {
              w: 1480, 
              h: 780
          }, 
          {
            zIndex: 1
          }
        );
        this.gMap.addLayer(gImageLayer);
        // 矢量层实例\添加
        this.gFeatureLayer = new AILabel.Layer.Feature('featureLayer', 
          {
            zIndex: 2, 
            transparent: true
          }
        );
        this.gMap.addLayer(this.gFeatureLayer);
 
      },
      //获取所有标记
      getallmark(){
        let marker,
        that = this;
        let newData = this.tableData.filter(item =>  item.coordinateX !=0&&item.coordinateY !=0 )
        for(let arr of newData){
            marker = new AILabel.Marker(arr.id, {
              src:require('../../../assets/images/green.png'),
              x: arr.coordinateX,
              y: arr.coordinateY,
              offset: {x: -10, y: -10},
            });
          this.markerArr.push(marker)
          this.gMap.mLayer.addMarker(marker);
        }
      },
      makemark(x,y,id,dian){
        if( this.clounmMark ){//如果存在行mark就要删除
          this.gMap.mLayer.removeMarker(this.clounmMark)
        }
          let  marker = new AILabel.Marker(id, {
              src:dian,
              x: x,
              y: y,
              offset: {x: -10, y: -10},
          });
          this.clounmMark = marker
          this.gMap.mLayer.addMarker(marker);
      },
      //点击开始标记 ：切换操作文字为标记
      startmark(){
        this.ismark =!this.ismark;
        this.specailText = '标记';
        let marker,
        that = this;
        this.gMap.mLayer.removeAllMarkers();//删除所有标记
       
      },
      //点击结束标记
      stopmark(){
        if(this.havepoints){//点击结束标记隐藏已有点
          this.fea.hide()
        }
        this.specailText = '查看'
        this.ismark =!this.ismark;
        this.iscloummark =!this.iscloummark;
        this.gMap.setMode('pan', new AILabel.Style({}));//使图片放弃标点行为，转换为平移图片事件
        this.markerArr =[]
        this.getallmark();
      },
      getmakemark(items){
        console.log(items)
        if(this.ismark){//开始标记点位
            this.iscloummark = true;
            this.clounmIndex = items.$index;
           
            if(items.row.coordinateX || items.row.coordinateY ){
              // console.log("存在",items.row.coordinateX)
              //如果当前table行存在标记点那就要生成一个和标记点相同坐标的Mark
              this.makemark(items.row.coordinateX,items.row.coordinateY,items.row.detectorId,this.greenDian)
            }
            if(this.fea){
              //当之前已经在图片上标记是在点击标记按钮时，清除之前的标记点
              this.fea.hide()
            }
            this.imageMaker(items.row.detectorId);
            
        }else{
            console.log("查看标记")
            if(items.row.coordinateX || items.row.coordinateY ){
              //如果当前table行存在标记点那就要生成一个和标记点相同坐标的Mark
              if(this.clounmMark){
                this.gMap.mLayer.removeMarker(this.clounmMark)
              }
              this.makemark(items.row.coordinateX,items.row.coordinateY,items.row.detectorId,this.redDian)
            }else{
              if(this.clounmMark){
                this.gMap.mLayer.removeMarker(this.clounmMark)
              }
              this.$message({
                message: '该部件没有标记',
                type: 'warning'
              });
            }


        } 
      },
      //标记点
      imageMaker(id){

            let drawPoint ={
                drawStyle: {pointRadius: 10},
                featureStyle: {strokeColor: 'blue', fillColor: 'rgb(85,142,213)', opacity: 1, pointRadius: 10}
            }
            let drawStyle = drawPoint.drawStyle;
            this.gMap && this.gMap.setMode('drawPoint', new AILabel.Style(drawStyle));
            
            this.gMap.events.on('geometryDrawDone', (type, points, options)=> {
               const featureStyle = drawPoint.featureStyle;
              console.log("type, points, options",type, points, options)
              if(this.clounmMark){//删除行Mark
                this.gMap.mLayer.removeMarker(this.clounmMark);
              }
              if(this.havepoints){//隐藏已有点
                this.fea.hide()
              }
              console.log('--points--', points);
              this.havepoints = points
              const timestamp = new Date().getTime();
             
              const {radius = 10} = options || {};
              this.fea = new AILabel.Feature.Point(id, points, {
                  name: '中国'
              }, featureStyle);
              this.gFeatureLayer.addFeature(this.fea);
              this.updateP(points.x,points.y,id)
            })

      },
      //修改某一个部件的标点位置
      updateP(x,y,id){
        let markObject ={
              coordinateX:x,
              coordinateY:y,
              detectorId:id
        };
        this.$axios.put(this.$api.UpdateDetectorCoordinate,markObject).then(res=>{
          console.log("修改点位成功",res)

          this.tableData[this.clounmIndex].coordinateX = x;
          this.tableData[this.clounmIndex].coordinateY = y;
        }).catch(err=>{
          console.log("修改点位失败",err)
        })
      },
      clearMark(){

      }
    

          
    }
}
</script>

<style lang="less">
    .fireAlarmLocationBox{
        padding: 10px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        color: white;
        .left{
            position: absolute;
            width:35%;
            height:100%;
            top:0;
            left:0;
            padding:20px;
            box-sizing:border-box;
            .left_top{
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                p{
                    margin-right: 40px;
                }
            }
            .el-scrollbar {
                height: 100%;
                width: 100%;
            }
            .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            .el-scrollbar__view{
                height: 100%;
            }
        }
        .right{
          position: absolute;
          width:65%;
          height:100%;
          top:0;
          right:0;
          padding:20px;
          box-sizing:border-box;
          border: 2px solid rgb(0, 132, 255);
            #dv{
               
              width: 100%;         // 必须
              height: 100%;        // 必须
              position: relative;   // 必须
              cursor: pointer;
        
            }
            img{
                width:100%;
                height:100%;
            }
            
            
            #markerLayer{
              img{
                width: 20px;
                height: 20px;
              }
            }
        }
        .dd{
            border-radius: 8px;
        }
        .hoverp{
          width: 200px;
          height: 50px;
          background: white;
          color:darkcyan;
          position: absolute;
          left: 50px;

        }
    }
</style>
