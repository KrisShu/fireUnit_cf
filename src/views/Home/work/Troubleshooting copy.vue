<template>
  <div class="Troubleshooting">
      <div class="BTNS_radio">
        <div class="BTNS">
            <el-button :class="arr.class" @click="topScreen(arr.text)"  v-for="(arr,x) in top_screen_btn"  :key="x" type="primary">
                <div class="btn_textnum">
                    <i v-show="top_screen_flag == arr.text" class="el-icon-star-on"></i>
                    <div>
                        <p>{{arr.text}}</p>
                        <p>{{arr.num}}</p>
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
      ></baseTable>

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
          prop:'test',
          label:'故障时间'
        },
        {
          prop:'test',
          label:'消防联网设施'
        },
        {
          prop:'test',
          label:'部件编号'
        },
        {
          prop:'test',
          label:'部件类型'
        },
        {
          prop:'test',
          label:'具体位置'
        },
        {
          prop:'test',
          label:'故障类型'
        },
        {
          label:'操作'
        }
      ],
      columnList_will_Inspection:[
        {
          prop:'test',
          label:'提交时间'
        },
        {
          prop:'test',
          label:'提交人'
        },
        {
          prop:'test',
          label:'建筑'
        },
        {
          prop:'test',
          label:'消防系统'
        },
        {
          prop:'test',
          label:'故障描述'
        },
        {
          label:'操作'
        },
      ],
      tableData:[
        {
          test:'测试'
        }
      ]
    }
  },
  created(){
    this.columnList = this.columnList_will_network
  },
  methods:{
    topScreen(text){
      this.top_screen_flag = text
      if(text == '待处理'){
        if(this.radio == 1){//此时为联网设施故障

          if(this.columnList_will_network.length == 8){
            this.columnList_will_network.splice(6,1)
          }
          this.columnList = this.columnList_will_network
        }else if(this.radio == 2){//此时为消防巡查

          if(this.columnList_will_Inspection.length == 7){
            this.columnList_will_Inspection.splice(5,1)
          }
          this.columnList = this.columnList_will_Inspection
         
        }
      }else if(text == '已处理'){
        if(this.radio == 1){//此时为联网设施故障
          let obj= {
            prop:'test',
            label:'处理时间'
          }
          if(this.columnList_will_network.length == 7){ //防止多次点击多次插入
             this.columnList_will_network.splice(6, 0, obj);
          }
         
          this.columnList = this.columnList_will_network
        }else if(this.radio == 2){
          let obj= {
            prop:'test',
            label:'处理时间'
          }
          if(this.columnList_will_Inspection.length == 6){ //防止多次点击多次插入
             this.columnList_will_Inspection.splice(5, 0, obj);
          }
          this.columnList = this.columnList_will_Inspection

         
        }
      }

    },
    radiochange(num){
      console.log(num)
      if(num == 1){//此时为联网设施故障
        if(this.top_screen_flag == '待处理'){
            if(this.columnList_will_network.length == 8){
              this.columnList_will_network.splice(6,1)
            }
            this.columnList = this.columnList_will_network
        }else if(this.top_screen_flag == '已处理'){
            let obj= {
              prop:'test',
              label:'处理时间'
            }
            if(this.columnList_will_network.length == 7){ //防止多次点击多次插入
              this.columnList_will_network.splice(6, 0, obj);
            }
         
            this.columnList = this.columnList_will_network
        }
      }else if(num == 2){
        if(this.top_screen_flag == '待处理'){
            if(this.columnList_will_Inspection.length == 7){
              this.columnList_will_Inspection.splice(5,1)
            }
            this.columnList = this.columnList_will_Inspection
        }else if(this.top_screen_flag == '已处理'){
          let obj= {
            prop:'test',
            label:'处理时间'
          }
          if(this.columnList_will_Inspection.length == 6){ //防止多次点击多次插入
             this.columnList_will_Inspection.splice(5, 0, obj);
          }
          this.columnList = this.columnList_will_Inspection
        }
      }
    }
  }
}
</script>

<style lang="less">
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
</style>