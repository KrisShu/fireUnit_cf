<template>
  <div class="buildinfo_right_build">
        <el-form :model="add_buildForm" :rules="rules" ref="add_buildForm" label-width="100px" class="add_buildForm">
                <el-form-item label="建筑名称:" prop="name">
                    <el-input v-model="add_buildForm.name"></el-input>
                </el-form-item>
                <el-form-item label="消防负责人:" prop="contractUser">
                    <el-input v-model="add_buildForm.contractUser"></el-input>
                </el-form-item>
                
                <el-form-item label="耐火等级:" prop="fireLevel">
                    <el-select v-model="add_buildForm.fireLevel" placeholder="选择耐火等级">
                        <el-option label="一级" value="一级"></el-option>
                        <el-option label="二级" value="二级"></el-option>
                        <el-option label="三级" value="三级"></el-option>
                        <el-option label="四级" value="四级"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="建筑结构:" prop="structure">
                    <el-input v-model="add_buildForm.structure"></el-input>
                </el-form-item>
                <el-form-item label="建造年代:" prop="buildYear">
                    <el-input v-model="add_buildForm.buildYear">
                      <template slot="append">年</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="建筑面积:" prop="area">
                    <el-input v-model="add_buildForm.area">
                      <template slot="append">M²</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="建筑高度:" prop="height">
                    <el-input v-model="add_buildForm.height">
                      <template slot="append">M</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="update">保存</el-button>
                    <el-button class="delete" @click="deletebuild(add_buildForm.id)">删除</el-button>
                </el-form-item>
        </el-form>
        <baseUploadImg 
        uploadimgtext="建筑平面图"
        @getuploadimgfile="getuploadimgfile"  
        :showimgurl="add_buildForm.outward_PictureURL"
        >
        </baseUploadImg>

  </div>
</template>

<script>
import baseUploadImg from '../../../components/baseUploadImg'
import bus from '../../../plugins/eventBus'
export default {
    components:{
        baseUploadImg,
    },
    props:{
        buildInfo:{
            type:Number,
            default(){
                return 0
            }
        }
    },
    watch: {
      buildInfo(val,old) { //可以通过watch来更新选中的建筑
            // console.log("val",val,old)
            this.GetArchitectureById(val)
      }
    },
    mounted(){
        if(this.buildInfo){
            this.GetArchitectureById(this.buildInfo)
        }
        
      
    },
    data(){
        return{
            //新增建筑
            add_buildForm:{
                img:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        //获取单个建筑的具体信息
        GetArchitectureById(id){
            // console.log("获取单个建筑的id",id)
            this.$axios.get(this.$api.GetArchitectureById,{params:{id}}).then(res=>{
                // console.log("获取单个建筑的信息",res);
                this.add_buildForm = res.result;
                if(res.result.outward_Picture){
                    res.result.outward_PictureURL =  `${this.$URL}${res.result.outward_Picture}`
                }else{
                    res.result.outward_PictureURL = ''
                }
            })
        },
        //获取图片file文件对象
        getuploadimgfile(file){
            // console.log("获取图片file文件对象",file)
            this.add_buildForm.outward_Picture = file
        },
        //更新
        update(){
            // console.log('建筑信息',this.add_buildForm);

            let formdata = new FormData();
            for(let i in this.add_buildForm){
                if(this.add_buildForm[i] != null){
                    formdata.append(i,this.add_buildForm[i]) //如果存在数据则上传该数据
                }else{//否则上传空字符串
                    formdata.append(i,'')
                }
                
            }
            this.$axios.put(this.$api.UpdateArchitecture,formdata).then(res=>{
                // console.log("修改信息",res)
                bus.$emit('updatebuild','')//兄弟组件传值:修改建筑信息后通知buildInfo_left刷新所有建筑信息
                if(res.success){
                    this.$message({
                        message: '更改建筑信息成功',
                        type: 'success'
                    });

                }
            })
        },
        //删除建筑
        deletebuild(id){
            this.$confirm('确认删除该建筑吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(this.$api.DeleteArchitecture,{params:{id}}).then(res=>{
                    bus.$emit('updatebuild','')//兄弟组件传值:修改建筑信息后通知buildInfo_left刷新所有建筑信息
                    // console.log("删除数据",res)
                    if(res.success){
                        this.$message({
                            message: '删除建筑数据成功',
                            type: 'success'
                        });

                    }
                })
            }).catch(() => {
                    
            });
           
        }
    }
}
</script>

<style lang="less">
    .buildinfo_right_build{
        padding-top: 50px;
        display: flex;
        align-items: flex-start;
        // width: 100%;
        justify-content: space-around;
        .el-form{
            width: 50%;
            .delete{
                background: rgb(156, 156, 156);
                color: #fff;
                border-color:rgb(156, 156, 156) ;
            }
        }
    }
</style>