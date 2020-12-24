<template>
    <div class="buildinfo_right_floor">
        <div class="add_delete">
            <el-button size="mini" @click="edit_floor" type="primary">编辑</el-button>
            <el-button size="mini"  @click="delete_floor" class="delete">删除</el-button>
        </div>
        <el-tabs @tab-click="tab_click" type="border-card">
                <el-tab-pane label="平面图">
                    <div class="planBox">
                       <div style="textAlign:right;width:100%">
                            <input class="chooseplan" type="file" ref="uploadInput" @change="upload">
                          <el-button @click="chooseplan" type="primary">选择平面图</el-button>
                       </div>
                       <!-- 如果存在图片则显示 -->
                         <el-image 
                            style="width: 100%; height: 72%"
                            :src="uploadImgsrc" 
                            :preview-src-list="srcList"
                            v-if="uploadImgsrc"
                        >
                        </el-image>
                        <!-- 不存在则显示默认 -->
                        <el-image v-else>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="联网部件">
                    <div class="parts_table">
                        <div class="btns_select">
                            <el-form :inline="true" :model="selectform" class="demo-form-inline">
                                <el-form-item label="部件编号">
                                    <el-input clearable v-model="selectform.sn" placeholder="部件编号"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">查询</el-button>
                                </el-form-item>
                            </el-form>

                            <div class="btns">
                                <el-button @click="add_part" type="success">新增</el-button>
                                <el-button @click="import_part" type="primary" >导入</el-button>
                                <el-button @click="opensignwindow" type="primary">标记点位</el-button>
                            </div>
                           
                        </div>
                        <baseTable 
                        :columnList='columnList' 
                        :tableData ='tableData'
                        tableName='detail_delete'
                        @getdetails="getdetails"
                        @deleteData="deleteData"
                        ></baseTable>
                        <basePage :propPage="page_part" @currentChange="GetDetectorListByFloor"></basePage>
                    </div>
                </el-tab-pane>
        </el-tabs>

        <!-- 楼层信息编辑 -->
        <basedialog @submit="submit_floor" :footershow="true" title="新增楼层" ref="edit_floorDialog">
          <el-form :model="edit_floorForm"  ref="edit_floorForm" label-width="100px" class="edit_floorForm">
             <el-form-item label="建筑名称:" prop="allbuild_data">
                    <el-select disabled v-model="edit_floorForm.architectureId" placeholder="请选择活动区域">
                        <el-option 
                        v-for="(arr,x) in allbuild_data" 
                        :key="x" 
                        :label="arr.name" 
                        :value="arr.id"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="楼层名称:" prop="name">
                <el-input v-model="edit_floorForm.name"></el-input>
            </el-form-item>
          </el-form>
        </basedialog>
        <!--楼层部件新增和编辑的弹窗 -->
        <basedialog @submit="submit_addpart" :footershow="true" title="部件" ref="add_detailDialog">
            <el-form  :rules="rules_part" :model="add_detail_partsForm"  ref="add_detail_partsForm" label-width="100px" class="add_detail_partsForm">
                <el-form-item label="所属网关:" prop="gatewayId">
                        <el-select  v-model="add_detail_partsForm.gatewayId" placeholder="请选择所属网关">
                            <el-option 
                            v-for="(arr,x) in all_gateway" 
                            :key="x" 
                            :label="arr.gatewaySn" 
                            :value="arr.gatewayId"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="部件编号:" prop="detectorSn">
                    <el-input v-model="add_detail_partsForm.detectorSn"></el-input>
                </el-form-item>
                <el-form-item label="部件类型:" prop="detectorType">
                    <el-input v-model="add_detail_partsForm.detectorType"></el-input>
                </el-form-item>
                <el-form-item label="具体位置:" prop="location">
                    <el-input v-model="add_detail_partsForm.location"></el-input>
                </el-form-item>
            </el-form>
        </basedialog>
        <!-- 导入模板 -->
        <basedialog title="部件导入" width="24%" class="networkreport"  ref="networkreport">
            <div class="networkreport_content"> 
                <p class="tip">注：导入的方式会覆盖现有的记录，如果要新增部分联网部件，请使用“新增”功能</p>
                <p><span>楼层：</span> {{importdata.floor}}</p>
                <div class="selecte_getway">
                    <span>网关：</span>
                    <el-select  v-model="importdata.GatewayId" placeholder="请选择网关">
                        <el-option 
                        v-for="(arr,x) in all_gateway" 
                        :key="x" 
                        :label="arr.gatewaySn" 
                        :value="arr.gatewayId"></el-option>
                    </el-select>
                </div>
                <div>
                    <!----- 上传部分 ----->
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action=""
                        name="excelFile"
                        :multiple="false"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :http-request="uploadFile"
                        :before-upload="beforeAvatarUpload_part"
                        :file-list="part_fileList"
                        :auto-upload="false"
                    > 
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">
                            <p>只能上传excel文件</p> 
                        </div>
                    </el-upload>
                   
                    <!----- 下载按钮 ----->
                    <div class="bottom">
                        <!-- <el-link href="http://fu.sctsjkj.com/template/联网部件导入.xlsx" type="primary">模板下载</el-link> -->
                        <el-link :href='href' type="primary">模板下载</el-link>
                    </div>

                </div>
            </div>
        </basedialog>
  </div>
</template>

<script>
import bus from '../../../plugins/eventBus'
export default {
    props:{
        floorInfo:''
    },
    watch:{
        floorInfo(val){
            // console.log("floor_val",val)
            this.page_part.FloorId =val
            this.GetFloorById(val);//通过watch监测楼层的变化
            this.GetDetectorListByFloor();
            this.GetGatewayDropdown();

        }
    },
    data() {
      return {
        href:`${this.$noportURL}/template/联网部件导入.xlsx`,
        architectureId:this.$store.state.buildID,//该楼层的所属建筑id
        uploadImgsrc: '',//平面图拿到的base64
        srcList:[ ],//大图预览数组
        edit_floorForm:{},//编辑楼层信息框
        allbuild_data:[],//所有建筑信息
        page_part:{
            FloorId :'',
            DetectorSn:'',
            SkipCount:0,
            total:0,
            MaxResultCount:9
        },
        columnList:[
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
                prop:'location',
                label:'具体位置'
            },
            {
                label:'操作'
            }
        ],
        tableData:[],
        all_gateway:[],//所有的网关
        selectform:{
            sn:''
        },//查询
        add_detail_partsForm:{//新增部件
            floorId:'',
            fireUnitId:this.$store.state.userInfo.fireUnitID,
            gatewayId:'',
            detectorSn:'',//部件编号
            detectorType:'',//部件类型
            location:'',//具体位置

        },
        rules_part:{
            gatewayId: [
                { required: true, message: '请选择所属网关', trigger: 'change' }
            ],
            detectorSn: [
                { required: true, message: '请输入部件编号', trigger: 'change' }
            ],
            detectorType: [
                 { required: true, message: '请输入部件类型', trigger: 'blur' },
            ],
            location: [
                { required: true, message: '请输入具体位置', trigger: 'blur' },
            ],
        },
        part_fileList:[],
        //导入数据
        importdata:{
            GatewayId:'',
            FloorId:'',
            floor:'',
        }
      };
    },
    mounted(){
        // console.log('初始化楼层',this.floorInfo)
        this.GetFloorById(this.floorInfo)//获取楼层信息
        this.GetArchitectureTreeByFireUnitId();//获取所有建筑信息
        this.page_part.FloorId = this.floorInfo//初始化
    },
    methods: {
        //tab页切换
        tab_click(e){
            // console.log(e)
            if(e.index == 1){//选择联网部件状态
                this.GetDetectorListByFloor();
                this.GetGatewayDropdown();
            }
        },  
        //获取所有建筑
        GetArchitectureTreeByFireUnitId(){
            this.$axios.get(this.$api.GetArchitectureTreeByFireUnitId,
            {params:{fireUnitId:this.$store.state.userInfo.fireUnitID}}
            ).then(res=>{
                // console.log("获取总建筑",res);
                this.allbuild_data = res.result
            })
        },
        //获取该楼层的具体信息
        GetFloorById(floorId){
            this.srcList =[];
            this.$axios.get(this.$api.GetFloorById,{params:{floorId}}).then(res=>{
                // console.log("获取该楼层的",res);
                this.edit_floorForm = res.result
                if( this.edit_floorForm.floor_Picture){
                    this.uploadImgsrc = `${this.$URL}${this.edit_floorForm.floor_Picture}`
                    this.srcList.push(this.uploadImgsrc)
                }else{
                     this.uploadImgsrc = ''
                }
                // console.log(this.uploadImgsrc)
            })
        },

        //编辑
        edit_floor(){
            this.$refs.edit_floorDialog.dialogVisible = true
        },
        //编辑楼层信息提交
        submit_floor(){
           
            this.$axios.put(this.$api.UpdateFloor,this.edit_floorForm).then(res=>{
                // console.log('res')
                if(res.success){
                    bus.$emit('updatebuild','')//兄弟组件传值:修改建筑信息后通知buildInfo_left刷新所有建筑信息
                    this.$message({
                        message: '更改楼层信息成功',
                        type: 'success'
                    });
                }
            })
               
        },
        //删除
        delete_floor(){
            this.$confirm('确认删除楼层吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(this.$api.DeleteFloor,{params:{floorId:this.floorInfo}}).then(res=>{
                    if(res.success){
                        this.$message({
                            message: '删除楼层成功',
                            type: 'success'
                        });
                        bus.$emit('updatebuild','')//兄弟组件传值:修改建筑信息后通知buildInfo_left刷新所有建筑信息
                    }
                })
            }).catch(() => {
                    
            });
        },
        //选择平面图
        chooseplan(){
            let input = this.$refs.uploadInput
            input.click();
        },
        //获取选择的图片file
        upload(){
            let input = this.$refs.uploadInput
            let imgFile = input.files[0]; //拿到的图片文件
            this.SubmitFloorPicture(imgFile)
            this.fileToBase64(imgFile).then(res=>{
                this.uploadImgsrc = res
            })
            
        },
        //修改楼层平面图
        SubmitFloorPicture(Floor_Picture){
            let formdata = new FormData();
            formdata.append('Id',this.floorInfo)
            formdata.append('Floor_Picture',Floor_Picture)
            this.$axios.post(this.$api.SubmitFloorPicture,formdata).then(res=>{
                // console.log("修改图片",res)
                if(res.success){
                    this.$message({
                        message: '更改楼层图片成功',
                        type: 'success'
                    });
                    this.GetFloorById(this.floorInfo)
                }
            })
        },
        //file文件转base64
        fileToBase64(file){
            let reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve,reject)=>{
                reader.onload = function () { 
                    if(this.result){
                        resolve(this.result)
                    }else{
                        reject("err")
                    }

                }
            })  
        },
        //获取所有网关
        GetGatewayDropdown(){
            this.$axios.get(this.$api.GetGatewayDropdown,{params:{architectureId:this.architectureId}}).then(res=>{
                // console.log("获取所有网关",res);
                this.all_gateway = res.result;
                this.importdata.GatewayId = res.result[0].gatewayId
            })
        },
        //根据楼层获取部件列表
        GetDetectorListByFloor(){
            this.$axios.get(this.$api.GetDetectorListByFloor,{params:this.page_part}).then(res=>{
                // console.log("根据楼层获取部件列表",res);
                ({items:this.tableData,totalCount:this.page_part.total}=res.result)
            })
        },
        onSubmit(){
            this.page_part.DetectorSn = this.selectform.sn
            this.GetDetectorListByFloor();
        },
        //打开新增联网部件的弹窗
        add_part(){
          
            this.$refs.add_detailDialog.dialogVisible = true
            this.$nextTick(()=>{
                this.$refs.add_detail_partsForm.resetFields();
            })
            // console.log(this.add_detail_partsForm)
            this.add_detail_partsForm.detectorId = ''
            this.add_detail_partsForm.floorId = this.floorInfo//初始化
            this.add_detail_partsForm.fireUnitId=this.$store.state.userInfo.fireUnitID;
        },
        //新增部件
        submit_addpart(){
            // console.log(this.add_detail_partsForm);
            this.$refs.add_detail_partsForm.validate((valid) => {
                if(valid){
                    let axios = this.add_detail_partsForm.detectorId ? this.$axios.put(this.$api.UpdateDetector,this.add_detail_partsForm) :
                    this.$axios.post(this.$api.AddDetector,this.add_detail_partsForm);

                    axios.then(res=>{
                        // console.log("新增部件",res)
                        if(res.success){
                            let message = this.add_detail_partsForm.detectorId ? '修改成功':'新增部件成功';
                            this.$message({
                                message,
                                type: 'success'
                            });
                            this.$refs.add_detailDialog.dialogVisible = false
                            this.GetDetectorListByFloor();
                        }
                    }).catch(err=>{
                        this.$message({
                            message:err.data.error.message,
                            type: 'error'
                        });
                    })
                }
            })
        },
        //打开网关详情弹窗
       getdetails(rowdata){
           this.$refs.add_detailDialog.dialogVisible = true
           this.GetDetectorInfo(rowdata.detectorId)
       },
       //获取某一条网关的基本信息
       GetDetectorInfo(detectorId){
           this.$axios.get(this.$api.GetDetectorInfo,{params:{detectorId}}).then(res=>{
            //    console.log("获取某一条网关的信息",res)
               this.add_detail_partsForm = res.result
           })
       },
        //删除网关
        deleteData(rowdata){
            this.$axios.delete(this.$api.DeteleDetector,{params:{detectorId:rowdata.detectorId}}).then(res=>{
                if(res.success){
                   
                    this.$message({
                        message:'删除数据成功',
                        type: 'success'
                    });
                    this.GetDetectorListByFloor();
                }
            })
        },
        //打开导入部件列表弹窗
        import_part(){
            this.$refs.networkreport.dialogVisible = true
            let buildname ,currentbuild,floorname;
            for(let arr of this.allbuild_data){
                if(this.$store.state.buildID == arr.id){
                    currentbuild  = arr
                    buildname = arr.name
                }
            }
            for(let arr of currentbuild.floors){
                if(this.floorInfo == arr.id){
                    floorname = arr.name
                }
            }
            this.importdata.floor = `${buildname}${floorname}`
            this.importdata.FloorId = this.floorInfo;
            
        },
        handleExceed(){
            this.$notify({
                title: '警告',
                message: '只能上传一个文件哦!,若需要上传其他文件请先移除已选择的文件',
                type: 'warning'
            });
        },
        //上传到服务器数据
        uploadFile(item){
            const form = new FormData();
            form.append('GatewayId',this.importdata.GatewayId)
            form.append('FloorId',this.importdata.FloorId)
            form.append('file',item.file)
            this.$axios.post(this.$api.ImportDetector,form).then(res=>{
                // console.log("res",res)
                if(res.success){
                    this.$message({
                        message: '导入数据成功!',
                        type: 'success'
                    });
                    this.GetDetectorListByFloor();
                }
                this.part_fileList =[];//清空上传的展示列表
                this.$refs.networkreport.dialogVisible = false
            }).catch(err=>{
                // console.log("err",err)
                    this.$message({
                        showClose: true,
                        message: `导入失败！${err.data.error.message}`,
                        type: 'error',
                        duration:'6000'
                    });
            })


        },
        //上传之前的判断文件大小和格式
        beforeAvatarUpload_part(file){
            const extension = file.name.split(".")[1] === "xls";
            const extension2 = file.name.split(".")[1] === "xlsx";
            if (!extension && !extension2){
                 this.$notify({
                    title: '警告',
                    message: '上传模板只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
        },
        //上传
        submitUpload(){
            this.$confirm('导入的方式会覆盖现有的记录, 是否继续?', '导入数据', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {
                this.$refs.upload.submit();
                    
            }).catch(() => {

            });
        },
        //打开火警点位新窗口
        //火警点位
        opensignwindow(){
            const {href} = this.$router.resolve({
                name: "MakeMark",
                query:{
                    floor_id:this.floorInfo
                }
            });
            window.open(href, '_blank');
        }
     
      
       
        
     
      
    }
}
</script>

<style lang="less">
    .buildinfo_right_floor{
        padding:0px 20px;
        position: relative;
        // width: 100%;
        .add_delete{
            position: absolute;
            right: 30px;
            top: 10px;
            z-index: 2;
            .delete{
                background: #9C9C9C;
                color: white;
                border-color: #9C9C9C;
            }
        }
        .el-tabs{
            height: 100%;
            display: flex;
            flex-direction: column;

            &.el-tabs--border-card{
                background: none;
                border: none;
                .el-tabs__header{
                    background: none;
                    .el-tabs__item{
                        color: white;
                    }
                    .el-tabs__item.is-active{
                        background:#409EFF ;
                        color: white;
                        border-color: #409EFF;
                    }
                }
                .el-tabs__content{
                    flex: 2 0 auto;
                    .el-tab-pane{
                        height: 100%;
                        .planBox{
                            height: 100%;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: center;
                            .chooseplan{
                                display: none;

                            }
                            .el-image{
                                width: 200px;
                                height: 200px;
                                position: absolute;
                                top: 25%;
                                .image-slot{
                                    width: 100%;
                                    height: 100%;
                                    i{
                                        color: white;
                                        font-size: 200px;
                                        font-weight: normal;
                                    }
                                }
                                .el-icon-circle-close{
                                    color: white;
                                }
                            }
                        }
                        .parts_table{
                            width: 100%;
                            .btns_select{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                margin-bottom: 10px;
                                .el-form>.el-form-item{
                                    margin-bottom: 0;
                                }
                                .btns{
                                    // display: flex;
                                    // margin-bottom: 10px;
                                }
                            }
                            
                        }
                    }
                   
                }
            }
        }
      

        //导入部件
        .networkreport{
            .networkreport_content{
                color: white;
                margin-bottom: 30px;
                .tip{
                    color: #9C9C9C;
                }
                p{
                    line-height: 2;
                }
                .selecte_getway{
                    margin: 10px 0px;
                    .el-select{
                        .el-input__inner{
                            background: #304F87;
                            color: white;
                            border: none;
                        }
                    }
                }
                
                .upload-demo{
                    margin: 18px 0px;
                }
                .el-upload-list__item-name{
                   i{
                       color: #5CB85C !important;
                   }
                    color: #5CB85C;
                }
                 

            }
        }
    }
</style>