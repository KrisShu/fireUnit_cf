<template>
  <div class="Troubleshooting">
      <div class="BTNS_radio">
        <div class="BTNS">
            <el-button :class="arr.class" @click="topScreen(arr.text)"  v-for="(arr,x) in top_screen_btn"  :key="x" type="primary">
                <div class="btn_textnum">
                    <i v-show="top_screen_flag == arr.text" class="el-icon-star-on"></i>
                    <div>
                        <p>{{arr.text}}</p>
                    </div>
                </div>
            </el-button>
        </div>

        <div class="radio">
            <span>问题来源：</span>
            <el-radio-group @change="radiochange" v-model="radio">
              <el-radio  :label="1">联网设施故障</el-radio>
              <el-radio  :label="2">消防巡查</el-radio>
            </el-radio-group>
        </div>
       
      </div>
      <!--  -->
      <baseTable 
          v-if="top_screen_flag == '待处理'"
          :columnList='columnList' 
          :tableData ='tableData'
          tableName='willdeal'
          @deal="deal"
      ></baseTable>
      <basePage :propPage="page" @currentChange="currentChange" ></basePage>

      <baseTable
          v-if="top_screen_flag == '已处理'"
          :columnList='columnList' 
          :tableData ='tableData'
          tableName='dealed'
          @dealdetail="dealdetail"
      ></baseTable>


      <!-- 处理弹窗 -->
      <basedialog @submit="submit_deal" :footershow="true" title="故障处理" ref="dealDialog">
            <el-form :model="dealform"  ref="dealform" label-width="100px" class="dealform">
                <el-form-item label="处理说明:" prop="handleRemark">
                  <el-input
                    type="textarea"
                    rows="4"
                    placeholder="请输入内容"
                    v-model="dealform.handleRemark">
                  </el-input>
                </el-form-item>

            </el-form>
      </basedialog>
      <!-- 处理详情弹窗 -->
      <basedialog  :footershow="false" title="处理详情" ref="dealdetailDialog">
        <div class="dealdetail">
          <div class="dealdetail_item">
            <span>处理详情：</span>
            <p>{{dealdetails}}</p>
          </div>
        </div>
      </basedialog>

  </div>
</template>

<script>
export default {
  data(){
    return{
      top_screen_flag:'待处理',
      top_screen_btn:[
        {
          text:'待处理',
          num:0,
          class:'yellow'
        },
        {
          text:'已处理',
          num:0,
          class:'green'
        }
      ],
      radio:1,//问题来源：
      columnList:[],
      columnList_will_network:[
        {
          prop:'faultTime',
          label:'故障时间'
        },
        {
          prop:'gatewaySn',
          label:'消防联网设施'
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
          prop:'location',
          label:'具体位置'
        },
        {
          prop:'faultType',
          label:'故障类型'
        },
        {
          label:'操作'
        }
      ],
      columnList_will_Inspection:[
        {
          prop:'faultTime',
          label:'提交时间'
        },
        {
          prop:'patrolUser',
          label:'巡查人员'
        },
        {
          prop:'architectureName',
          label:'建筑'
        },
        {
          prop:'faultRemark',
          label:'故障描述'
        },
        {
          label:'操作'
        },
      ],
      tableData:[],
      dealform:{
        type:'',
        faultDataId:'',
        handleRemark:'已记录报维保',
      },
      dealdetails:{},//处理详情
      page:{
        fireUnitId:this.$store.state.userInfo.fireUnitID,
        SkipCount:0,
        total:0,
        current:1,
        MaxResultCount:9,
      }
    }
  },
  created(){
    this.columnList = this.columnList_will_network;
    this.GetFaultDetectorNoHandleList();//获取待处理联网设施故障
  },
  methods:{
    topScreen(text){
      this.top_screen_flag = text
      this.page.current = 1;
      this.page.SkipCount = 0;
      if(text == '待处理'){
        if(this.radio == 1){//待处理下的联网设施故障  字段为7个 多余则删除

          if(this.columnList_will_network.length == 8){
            this.columnList_will_network.splice(6,1)
          }
          this.columnList = this.columnList_will_network
          this.GetFaultDetectorNoHandleList();
        }else if(this.radio == 2){//待处理下的消防巡查  字段为6个 多余则删除

          if(this.columnList_will_Inspection.length == 7){
            this.columnList_will_Inspection.splice(5,1)
          }
          this.columnList = this.columnList_will_Inspection
          this.GetFaultPatrolNoHandleList();
         
        }
      }else if(text == '已处理'){
        if(this.radio == 1){//此时为联网设施故障
          let obj= {
            prop:'handleTime',
            label:'处理时间'
          }
          if(this.columnList_will_network.length == 7){ //防止多次点击多次插入
             this.columnList_will_network.splice(6, 0, obj);
          }
         
          this.columnList = this.columnList_will_network
          this.GetFaultDetectorHandledList();
        }else if(this.radio == 2){
          let obj= {
            prop:'handleTime',
            label:'处理时间'
          }
          if(this.columnList_will_Inspection.length == 5){ //防止多次点击多次插入
             this.columnList_will_Inspection.splice(4, 0, obj);
          }
          this.columnList = this.columnList_will_Inspection
          this.GetFaultPatrolHandledList();
         
        }
      }

    },
    radiochange(num){
      console.log(num)
      this.page.current = 1;
      this.page.SkipCount = 0;
      if(num == 1){//此时为联网设施故障
        if(this.top_screen_flag == '待处理'){//待处理下的联网设施故障  字段为7个 多余则删除
            if(this.columnList_will_network.length == 8){
              this.columnList_will_network.splice(6,1)
            }
            this.columnList = this.columnList_will_network
            this.GetFaultDetectorNoHandleList();
        }else if(this.top_screen_flag == '已处理'){
            let obj= {
              prop:'test',
              label:'处理时间'
            }
            if(this.columnList_will_network.length == 7){ //防止多次点击多次插入
              this.columnList_will_network.splice(6, 0, obj);
            }
         
            this.columnList = this.columnList_will_network
            this.GetFaultDetectorHandledList();
        }
      }else if(num == 2){
        if(this.top_screen_flag == '待处理'){ //待处理下的消防巡查  字段为6个 多余则删除
            if(this.columnList_will_Inspection.length == 7){
              this.columnList_will_Inspection.splice(5,1)
            }
            this.columnList = this.columnList_will_Inspection
            this.GetFaultPatrolNoHandleList();
        }else if(this.top_screen_flag == '已处理'){
          let obj= {
            prop:'test',
            label:'处理时间'
          }
          if(this.columnList_will_Inspection.length == 5){ //防止多次点击多次插入
             this.columnList_will_Inspection.splice(4, 0, obj);
          }
          this.columnList = this.columnList_will_Inspection
          this.GetFaultPatrolHandledList();
        }
      }
    },
    //获取待处理联网设施故障
    GetFaultDetectorNoHandleList(){
      this.$axios.get(this.$api.GetFaultDetectorNoHandleList,{params:this.page}).then(res=>{
        console.log("获取待处理联网设施故障",res);
        ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },
    //获取已处理联网设施故障
    GetFaultDetectorHandledList(){
      this.$axios.get(this.$api.GetFaultDetectorHandledList,{params:this.page}).then(res=>{
        console.log("获取待处理联网设施故障",res);
        ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },
    //获取待处理消防巡查故障
    GetFaultPatrolNoHandleList(){
      this.$axios.get(this.$api.GetFaultPatrolNoHandleList,{params:this.page}).then(res=>{
        console.log("获取待处理联网设施故障",res);
        ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },
    //获取已处理消防巡查故障
    GetFaultPatrolHandledList(){
      this.$axios.get(this.$api.GetFaultPatrolHandledList,{params:this.page}).then(res=>{
        console.log("获取待处理联网设施故障",res);
        ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },

    //处理
    deal(rowdata){
      console.log(rowdata)
      this.$refs.dealDialog.dialogVisible  = true
      this.dealform.type = this.radio
      this.dealform.faultDataId = rowdata.faultDataId
    },

    //处理提交
    submit_deal(){
      this.$axios.post(this.$api.HandleFault,this.dealform).then(res=>{
          if(res.success){
            this.$message({
                message:'处理成功',
                type: 'success'
            });
            this.$refs.dealDialog.dialogVisible = false;
            if(this.radio == 1){
              this.GetFaultDetectorNoHandleList();
            }else if(this.radio == 2){
              this.GetFaultPatrolNoHandleList();
            }
          }   
      })
    },
    //处理详情
    dealdetail(rowdata){
      console.log(rowdata)
        this.$refs.dealdetailDialog.dialogVisible  = true;
        this.dealdetails = rowdata.handleRemark
    },
    //点击分页
    currentChange(){
      if(this.top_screen_flag == '待处理'){
         if(this.radio == 1){//待处理下的联网设施故障  字段为7个 多余则删除

          this.GetFaultDetectorNoHandleList();
        }else if(this.radio == 2){//待处理下的消防巡查  

          this.GetFaultPatrolNoHandleList();
         
        }
      }else if (this.top_screen_flag == '已处理'){
        if(this.radio == 1){//此时为联网设施故障
         
          this.GetFaultDetectorHandledList();
        }else if(this.radio == 2){
          this.GetFaultPatrolHandledList();
        }
      }
    }
  }
}
</script>

<style lang="less">
.Troubleshooting{
  height: 100%;
  display: flex;
  flex-direction: column;
  &>:nth-child(2){
      flex: 2 0 auto;
  }
  .BTNS_radio{
    margin-bottom: 20px;
      .BTNS{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        button{
            width: 140px;
            height: 54px;
            border: none;
            &.green{
                background: #28A745;
            }
            &.yellow{
                background: #FFC107;
            }
            .btn_textnum{
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                i{
                    margin-right: 10px;
                }
                p{
                    line-height: 1.3;
                }
            }
        }

      }
      .radio{
        &>span{
          color: white;
        }
        .el-radio__label{
          color: white;
          
        }
        .el-radio__input.is-checked+.el-radio__label{
          color: #409EFF;
        }

      }
  }

  //处理详情
  .dealdetail{
    .dealdetail_item{
      display: flex;
      font-size: 16px;
      color: white;
      &:nth-child(1){
        margin-bottom: 20px;
       
      }
    }
  }

}
</style>