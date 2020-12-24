<template>
    <div class="Inspection">
        <basescreenbtnAdd 
          :top_screen_btn="top_screen_btn"
          @topScreen="topScreen"
          @add='add'
        ></basescreenbtnAdd>
        <baseTable 
            :columnList='columnList' 
            :tableData ='tableData'
            tableName='detail_delete'
            @getdetails="getdetails"
            @deleteData="deleteData"
        ></baseTable>

        <!-- 新增和详情页面 -->
        <basedialog :footershow="true" @submit="submit" title="消防巡查" ref="add_detailDialog">
            <el-form :model="add_detailForm"  ref="add_detailForm" label-width="100px" class="add_detailForm">
                <el-form-item label="巡查日期:" prop="time">
                    <el-input disabled v-model="add_detailForm.time"></el-input>
                </el-form-item>
                <el-form-item label="巡查人员:" prop="patrolUser">
                    <el-input  v-model="add_detailForm.patrolUser"></el-input>
                </el-form-item>
                <div class="Patrol_list">
                  <el-scrollbar>
                    <div class="top">
                      <span>建筑</span>
                      <span>巡查结果</span>
                    </div>
                    <ul>
                      <li v-for="arr in ArchitectureList" :key="arr.id">
                        <div>
                          {{arr.name}}
                        </div>
                        <div>
                         
                            <el-select v-model="arr.patrolStatus" placeholder="请选择">
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input v-model="arr.patrolRemark" placeholder="请输入内容"></el-input>
                    
                          
                        </div>
                      </li>
                    </ul>
                  </el-scrollbar>
                </div>
            </el-form>
        </basedialog>
    </div>
</template>

<script>
let moment = require('moment');
export default {
  data(){
    return{
      top_screen_btn:[
        {
            text:'全部',
            class:'blue'
        },
        {
            text:'正常',
            class:'green',
            num:0
        },
        {
            text:'发现问题并解决',
            class:'green',
            num:0
        },
        {
            text:'发现问题未解决',
            class:'yellow',
            num:0
        },
      ],
      columnList:[
        {
          prop:'creationTime',
          label:'提交时间'
        },
        {
          prop:'patrolUser',
          label:'巡查人员'
        },
        {
          prop:'patrolStatus',
          label:'状态'
        },
        {
          label:'操作'
        },
      ],
      tableData:[ ],
      page:{
        FireUnitId:this.$store.state.userInfo.fireUnitID,
        PatrolStatus:0,//巡查状态
        SkipCount:0,
        total:0,
        MaxResultCount:6
      },//请求获取巡查记录列表的参数
      add_detailForm:{
        time:moment().format('YYYY-MM-DD'),
        patrolUser:'',//巡查人员
        userId:'',
        patrolDetailList:[
          {

          }
        ]

      },
      ArchitectureList:[],//所有建筑
      options: [
        {
          value: 1,
          label: '正常'
        }, 
        {
          value: 2,
          label: '发现问题并解决'
        }, 
        {
          value: 3,
          label: '发现问题未解决'
        }, 
      ]
    }
  },
  created(){
    this.GetArchitectureList();
    this.GetPatrolStatusNum();
    this.GetPatrolList();
  },
  methods:{
     //获取建筑下拉列表
    GetArchitectureList(){
      this.$axios.get(this.$api.GetArchitectureList,{params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}).then(res=>{
        console.log("获取建筑下拉列表",res)
        this.ArchitectureList = res.result
        for(let arr of this.ArchitectureList){
          this.$set(arr,'patrolStatus',1)
          this.$set(arr,'patrolRemark','')
          this.$set(arr,'architectureId',arr.id)
        }
      })
    },
    //获取巡查记录各状态数量
    GetPatrolStatusNum(){
      this.$axios.get(this.$api.GetPatrolStatusNum,{params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}).then(res=>{
        console.log("获取巡查记录各状态数量",res)
        this.top_screen_btn[1].num = res.result[0].value
        this.top_screen_btn[2].num = res.result[1].value
        this.top_screen_btn[3].num = res.result[2].value
      })
    },
    //获取巡查记录列表
    GetPatrolList(){
      this.$axios.get(this.$api.GetPatrolList,{params:this.page}).then(res=>{
        console.log("获取巡查记录列表",res);
         ({items: this.tableData,totalCount: this.page.total} = res.result);
      })
    },
    //顶部筛选
    topScreen(text){
      if(text == '全部'){
        this.page.PatrolStatus = 0
      }else if(text == '正常'){
        this.page.PatrolStatus = 1
      }else if(text == '发现问题并解决'){
        this.page.PatrolStatus = 2
      }else if(text == '发现问题未解决'){
        this.page.PatrolStatus = 3
      }
      this.GetPatrolList();
    },
    //打开新增弹窗
    add(){
      this.$refs.add_detailDialog.dialogVisible = true
      this.add_detailForm.time = moment().format('YYYY-MM-DD');
      this.add_detailForm.patrolUser ='';
      this.add_detailForm.patrolId ='';
      this.GetArchitectureList();
    },
    //打开详情弹窗
    getdetails(rowdata){
       this.$refs.add_detailDialog.dialogVisible = true
       setTimeout(()=>{
         this.GetArchitectureList();
       },50)
       setTimeout(()=>{//异步延迟调用详情
          this.GetPatrolInfo(rowdata.patrolId)
       },100)
      
    },
    //获取某条数据 的详情
    GetPatrolInfo(patrolId){
      this.$axios.get(this.$api.GetPatrolInfo,{params:{patrolId}}).then(res=>{
        console.log("获取详情",res);
        res.result.creationTime = this.delTime(res.result.creationTime)
        this.add_detailForm.patrolUser = res.result.patrolUser
        this.add_detailForm.time = res.result.creationTime
        this.add_detailForm.patrolId = res.result.patrolId

        for (let i = 0; i < this.ArchitectureList.length; i++) {//两个数据循环对比找建筑id相同的数据
            for (let j = 0; j < res.result.patrolDetailList.length; j++) {
                    if(this.ArchitectureList[i].architectureId == res.result.patrolDetailList[j].architectureId){
                      console.log(this.ArchitectureList[i])
                       this.ArchitectureList[i].patrolStatus = res.result.patrolDetailList[j].patrolStatus
                       this.ArchitectureList[i].patrolRemark = res.result.patrolDetailList[j].patrolRemark
                    }
            }
        }
      })
    },
    //新增和修改提交
    submit(){
      // console.log("add_detailForm",this.add_detailForm)
      // console.log("ArchitectureList",this.ArchitectureList)
      //获取建筑描述问题
      let arrs =[];
      for(let arr of this.ArchitectureList){
        if(arr.patrolStatus != 1 || arr.patrolRemark){
          arrs.push(arr)
        }
      }
      //拼接传输对象
      let submitobj ={}
      if(this.add_detailForm.patrolId){
        submitobj.patrolId = this.add_detailForm.patrolId
      }else{
        submitobj.fireUnitId = this.$store.state.userInfo.fireUnitID 
        submitobj.userId = this.$store.state.userInfo.userId
      }
      
      submitobj.patrolUser = this.add_detailForm.patrolUser
     
      submitobj.patrolDetailList = arrs
      console.log(submitobj)

      //阿上传数据
      let axios =  this.add_detailForm.patrolId ? this.$axios.put(this.$api.Update_Patrol,submitobj):
      this.$axios.post(this.$api.Add_Patrol,submitobj);
      axios.then(res=>{
        console.log("新增数据",res)
        if(res.success){
          let message = this.add_detailForm.patrolId ?'修改数据成功' :'新增数据成功'
            this.$message({
              message,
              type: 'success'
            });
            this.GetPatrolList();
            this.GetPatrolStatusNum();
            this.$refs.add_detailDialog.dialogVisible = false
        }
      })
    },
    //删除数据
    deleteData(){
      
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
  .Inspection{
    height: 100%;
    display: flex;
    flex-direction: column;
    &>:nth-child(2){
        flex: 2 0 auto;
    }
    .add_detailForm{
      .Patrol_list{
        height: 400px;
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
          .top{
            width: 100%;
            span{
              color: white;
              display: inline-block;
              text-align: center;
              &:nth-of-type(1){
                width: 20%;
              }
              &:nth-of-type(2){
                width: 80%;
              }
             
            }
          }
          ul{
            li{
              color: white;
              display: flex;
              margin: 20px 0px;
              align-items: center;
              &>div{
                text-align: center;
                &:nth-of-type(1){
                width: 20%;
                }
                &:nth-of-type(2){
                  width: 80%;
                  display: flex;
                  .el-select{
                    width: 30%;
                    margin-right: 10px;
                  }
                }
            
              }
            }
          }
      }
    }
  }
</style>