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
      <basedialogMark ref="locationDialog" :detectordetail="detectordetail"></basedialogMark>

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
      // console.log("筛选",data);
      this.page.ArchitectureId = data.ArchitectureId
      this.page.DetectorSn = data.DetectorSn
      this.page.ManagerInfo = data.ManagerInfo
      this.GetManagerInfoList();
    },
    //获取定位
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