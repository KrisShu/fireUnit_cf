<template>
    <div class="infomations">
      <baseSelect :flag="false" @select="select"></baseSelect>
       <baseTable 
        :columnList='columnList' 
        :tableData ='tableData'
        tableName='infomations'
        @getlocation="getlocation"
      ></baseTable>
      <basePage :propPage="page" @currentChange="GetManagerInfoList"></basePage>

      <!-- 定位弹窗 -->
      <basedialog :footershow="false"  width="50%" title="联网部件" ref="locationDialog">
            <div v-if="detectordetail.coordinatePicture" class="fireBit" id="fireBit" ref="fireBit">

            </div>
            <div class="fireBit" v-else>
                  <p class="noData">暂无图片</p>
            </div>
      </basedialog>
    </div>

</template>

<script>
import AILabel  from 'ailabel'
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
          prop:'managerInfo',
          label:'事件'
        },
        {
          label:'操作'
        },
      ],
      tableData:[],
      page:{
        ArchitectureId:'',
        DetectorSn:'',
        ManagerInfo:'',
        SkipCount:0,
        MaxResultCount:10,
        total:0,
      },
      detectordetail:{},//某个部件的具体信息
      gMap:{},//点位图层
      gFeatureLayer:'',
     partlocationICON:require('../../../assets/images/partlocation.png'),//部件定位icon


    }
  },
  created(){
    this.GetManagerInfoList();
  },
  methods:{
    //获取列表
    GetManagerInfoList(){
      this.$axios.get(this.$api.GetManagerInfoList,{params:this.page}).then(res=>{
        // for(let arr of res.result.items){
        //   arr.creationTime = this.delTime( arr.creationTime)
        // };
         ({items:this.tableData,totalCount:this.page.total}=res.result)
      })
    },
    //顶部筛选
    select(data){
      console.log("筛选",data);
      this.page.ArchitectureId = data.ArchitectureId
      this.page.DetectorSn = data.DetectorSn
      this.page.ManagerInfo = data.ManagerInfo
      this.GetManagerInfoList();
    },
    //获取定位
     getlocation(rowdata){
      this.$refs.locationDialog.dialogVisible  = true;
      this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId:rowdata.detectorId}}).then(res=>{
        
        console
        if(res.result.coordinatePicture){
            this.detectordetail = res.result;
            if( this.detectordetail.coordinatePicture){
              this.detectordetail.coordinatePicture = `${this.$URL}${this.detectordetail.coordinatePicture}`
             this.$nextTick(()=>{
                this.init();
                this.createMarker(this.detectordetail)
             })
            } 
        }
      })
    },
    init(){
        this.gMap = new AILabel.Map('fireBit',
            {
                zoom: 1500, 
                cx: 0, 
                cy: 0, 
                zoomMax: 650 * 10, 
                zoomMin: 650 / 10, 
                autoPan: true, 
                drawZoom: true
            }
        );
        // 图片层实例\添加
        const gImageLayer = new AILabel.Layer.Image('img',  this.detectordetail.coordinatePicture, 
            {
                w: 1080, 
                h: 720
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
    //标记点
    createMarker(content) {
      console.log("content",content)
      if(content.coordinateX == 0 && content.coordinateY == 0){
        return
      }
        let  marker = new AILabel.Marker(content.detectorId, {
            src:this.partlocationICON,
            x: content.coordinateX,
            y: content.coordinateY,
            offset: {x: -10, y: -10},
        });
            this.gMap.mLayer.addMarker(marker);
            let imga =  $("#markerLayer").find('img')
            imga.on({
                mouseenter: function (e) {
                    let p =$(`<div class='partlocationinfo'>
                    <p>【部件】：${content.detectorSn}</p>
                    <p>【位置】：${content.location}</p>
                    </div>`);
                    p.css({"position":"absolute"})
                    imga.after(p)
                },
                mouseleave: function (e) {
                    $('.partlocationinfo').remove()
                }
            })
    },

  }
}
</script>

<style lang="less">
    .infomations{
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
                  background: rgb(255, 255, 255);
                  padding: 10px;
                  border-radius: 6px;

              } 
          }
      }
    }
</style>