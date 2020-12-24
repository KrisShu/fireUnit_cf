<template>
    <div class="buildInfo_left">
       <div class="add_btn">
          <el-button @click="add_build">新增建筑</el-button>
          <el-button @click="add_floor">新增楼层</el-button>
       </div>
       <div class="eltree">
          <el-scrollbar>
            <el-tree
            ref="vuetree"
            :data="allbuild_data"
            :props="defaultProps"
            accordion
            node-key="id"
            :current-node-key="firstBuildId"
            :highlight-current="true"
            @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
       </div>
   
        <!-- 新增建筑 -->
        <basedialog @submit="submit_build" :footershow="true"  title="新增建筑" ref="add_buildDialog">
            <el-form :model="add_buildForm" :rules="rules" ref="add_buildForm" label-width="100px" class="add_buildForm">
                <el-form-item label="建筑名称:" prop="Name">
                    <el-input placeholder="请输入建筑名称" v-model="add_buildForm.Name"></el-input>
                </el-form-item>
                
                <el-form-item label="消防负责人:" prop="ContractUser">
                  <el-input placeholder="请输入联系人名称" v-model="add_buildForm.ContractUser"></el-input>
                </el-form-item>
                
                <el-form-item label="耐火等级:" prop="FireLevel">
                    <el-select v-model="add_buildForm.FireLevel" placeholder="请选择活动区域">
                        <el-option label="一级" value="一级"></el-option>
                        <el-option label="二级" value="二级"></el-option>
                        <el-option label="三级" value="三级"></el-option>
                        <el-option label="四级" value="四级"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑结构:" prop="Structure">
                    <el-input v-model="add_buildForm.Structure"></el-input>
                </el-form-item>
                <el-form-item label="建造年代:" prop="BuildYear">
                    <el-input v-model="add_buildForm.BuildYear">
                      <template slot="append">年</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="建筑面积:" prop="Area">
                    <el-input v-model="add_buildForm.Area">
                      <template slot="append">M²</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="建筑高度:" prop="Height">
                    <el-input v-model="add_buildForm.Height">
                      <template slot="append">M</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="上传图片:" ref="uploadElement" prop="Outward_Picture">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        list-type="picture-card"
                        :auto-upload="false"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :class="{hide:hideUpload}"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>

                </el-form-item>

            </el-form>
        </basedialog>
        <!-- 新增楼层 -->
        <basedialog @submit="submit_floor" :footershow="true" title="新增楼层" ref="add_floorDialog">
          <el-form :model="add_floorForm"  ref="add_floorForm" label-width="100px" class="add_floorForm">
             <el-form-item label="建筑名称:" prop="architectureId">
                    <el-select v-model="add_floorForm.architectureId" placeholder="请选择活动区域">
                        <el-option 
                        v-for="(arr,x) in allbuild_data" 
                        :key="x" 
                        :label="arr.name" 
                        :value="arr.id"></el-option>
                    </el-select>
                </el-form-item>
            <el-form-item label="楼层名称:" prop="name">
                <el-input v-model="add_floorForm.name"></el-input>
            </el-form-item>
          </el-form>
        </basedialog>

    </div>
</template>

<script>
import bus from '../../../plugins/eventBus'
export default {
    data() {
      return {
        allbuild_data: [],//所有建筑的信息树
        defaultProps: {//配置选项，具体看下表
          children: 'floors',
          label: 'name'
        },
        firstBuildId:'',//默认选中的节点树
        //新增建筑
        add_buildForm:{
          Name:'',
          ContractUser:'',
          ContractPhone:'',
          FireLevel:'',
          Structure:'',
          BuildYear:'',
          Area:'',
          Height:'',
          Outward_Picture:null,
          FireUnitId:this.$store.state.userInfo.fireUnitID
        },
        rules:{
            name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
        },
        //新增楼层
        add_floorForm:{
          architectureId:'',
          name:''
        }
          
        ,
        
        hideUpload:false, //控制新增图片的class
        fileList:[],
      };
    },
    created(){
      // this.add_floorForm.region = this.allbuild_data[0].name;
      this.GetArchitectureTreeByFireUnitId();
      bus.$on('updatebuild',()=>{
            this.GetArchitectureTreeByFireUnitId();
      })
    },
    methods: {
      //获取某个防火单位的所有建筑和楼层（常用于建筑树状展示）
      GetArchitectureTreeByFireUnitId(){
        this.$axios.get(this.$api.GetArchitectureTreeByFireUnitId,
          {params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}
        ).then(res=>{
            // console.log("获取总建筑",res);
            this.allbuild_data = res.result
            this.firstBuildId = res.result[0].id
            this.$store.commit("setbuildID",this.firstBuildId);//将建筑ID存储到store厂库中
            this.$nextTick(()=>{
              this.$refs.vuetree.setCurrentKey(this.firstBuildId);
            })

            this.add_floorForm.architectureId  = this.firstBuildId
            

            this.$emit('handleNodeClick',this.allbuild_data[0])//默认第一个建筑id
        })
      },
      //点击节点
      handleNodeClick(data,e) {
        // console.log(data)
        this.$emit('handleNodeClick',data)//传值给父组件
        if(data.floors){
            this.add_floorForm.architectureId  = data.id
            this.$store.commit("setbuildID", data.id);//将建筑ID存储到store厂库中
            // console.log('父节点1',this.add_floorForm.architectureId)
        }else{
            bus.$emit('sendByBus_f',data)//兄弟组件传值
            // console.log('子节点',data)
        }
      },
      //新增建筑
      add_build(){
        this.$refs.add_buildDialog.dialogVisible  = true
       
        
      },
      //新增建筑提交
      submit_build(){
          this.$refs.add_buildForm.validate((valid) => {
                if(valid){
                    // console.log(this.add_buildForm);
                    let formdata = new FormData();
                    for(let i in this.add_buildForm){
                      formdata.append(i,this.add_buildForm[i])
                    }
                    this.$axios.post(this.$api.AddArchitecture,formdata).then(res=>{
                      // console.log('新增建筑',res)
                      if(res.success){
                        this.$message({
                            message: '新增建筑成功',
                            type: 'success'
                        });
                          this.$refs.add_buildDialog.dialogVisible  = false;
                          this.GetArchitectureTreeByFireUnitId();
                      }
                    })
                   
                }
          })
      },
      //上传图片
      handleChange(file,fileList){
        // console.log(file.raw)
        this.add_buildForm.Outward_Picture = file.raw
        this.hideUpload = fileList.length>=1;
      },
      handleRemove(file,fileList){
         this.hideUpload = fileList.length>=1;
         this.add_buildForm.Outward_Picture = null

      },
      //新增楼层
      add_floor(){
        this.$refs.add_floorDialog.dialogVisible  = true
        
      },
      submit_floor(){
        this.$axios.post(this.$api.AddFloor,this.add_floorForm).then(res=>{
          // console.log('新增楼层',res)
          if(res.success){
            this.$message({
                message: '新增楼层成功',
                type: 'success'
            });
              this.$refs.add_floorDialog.dialogVisible  = false;
              this.GetArchitectureTreeByFireUnitId();
          }
        })
      }
    }
}
</script>

<style lang="less">
  .buildInfo_left{
    width: 204px;
    display: flex;
    flex-direction: column;
    height: 100%;
    .add_btn{
      display: flex;
      margin-bottom: 10px;
      button{
        color: white;
        border: none;
        &:nth-child(1){
          
          background: #3981FF;
        }
        &:nth-child(2){
          background: #409EFF;
          
        }
      }
    }
    .eltree{
      flex: 2 0 auto;
      height: 92%;
      border: 1px solid rgb(65, 147, 255);
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
      .el-tree{
         background: transparent;
          color: white;
         
         padding: 10px;
      }
     
      .el-tree-node__children{
        .el-tree-node{
          margin: 10px;
        }
      }
      .el-tree-node__content{
        padding-left:0 !important;
      }
      .el-tree-node:focus>.el-tree-node__content{
        background: #409EFF;
      }
      .el-tree-node__content:hover{
        background: #409EFF;
      }
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{//高亮选中
      background: #409EFF;
    }


    .el-upload--picture-card{
      background: none;
    }

  
      .hide .el-upload--picture-card {
          display: none;
      }
  }
</style>