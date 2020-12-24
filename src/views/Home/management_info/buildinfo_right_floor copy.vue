<template>
  <div class="buildinfo_right_floor">
        <div class="btn">
            <div class="left">
                <el-button @click="showImg">平面图</el-button>
                <el-button @click="edit">编辑</el-button>
                <el-button @click="deletefloor">删除</el-button>
            </div>
            <div class="right">
                <el-button @click="selectbtn('火警部件')" :class="{isactive: activename == '火警部件' }" type="text">火警部件</el-button>
                <el-button @click="selectbtn('可燃气体部件')" :class="{isactive: activename == '可燃气体部件' }" type="text">可燃气体部件</el-button>
                <el-button @click="selectbtn('电气火灾部件')" :class="{isactive: activename == '电气火灾部件' }" type="text">电气火灾部件</el-button>
            </div>
        </div>
        <div class="content">
            <!-- 楼层平面 -->
           <el-upload
                v-if="floorimg_show"
                class="avatar-uploader"
                action="#"
                :http-request="uploadIMG"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <span v-if="imageUrl" class="el-upload-action" @click.stop="handleRemove()">
                    <i class="el-icon-delete"></i>
                </span>
                <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
            </el-upload>
            <!-- 列表 -->
            <div class="List_box" v-else>
                <div class="List_top">
                    <div class="left">
                        <span>{{select_title}}网关</span>
                        <el-select v-model="select_value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="right">
                        <el-button @click="add_part">新增</el-button>
                        <el-button @click="import_part">导入</el-button>
                        <el-button @click="deletefloor">标记点位</el-button>
                    </div>
                  
                </div>
                <baseTable 
                :columnList='columnList' 
                :tableData ='tableData'
                tableName='staffInfo'
                ></baseTable>
            </div>
        </div>

        <!-- 楼层信息编辑 -->
        <basedialog @submit="submit_floor" :footershow="true" title="新增楼层" ref="edit_floorDialog">
          <el-form :model="edit_floorForm"  ref="edit_floorForm" label-width="100px" class="edit_floorForm">
             <el-form-item label="建筑名称:" prop="name">
                <el-input v-model="edit_floorForm.name"></el-input>
            </el-form-item>
            <el-form-item label="楼层名称:" prop="name">
                <el-input v-model="edit_floorForm.name"></el-input>
            </el-form-item>
          </el-form>
        </basedialog>
        <!--楼层部件新增和编辑的弹窗 -->
        <basedialog @submit="submit_floor" :footershow="true" title="部件" ref="add_detailDialog">
          <el-form :model="add_detail_partsForm"  ref="add_detail_partsForm" label-width="100px" class="add_detail_partsForm">
             <el-form-item label="部件编号:" prop="name">
                <el-input v-model="add_detail_partsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="部件类型:" prop="name">
                <el-input v-model="add_detail_partsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="具体位置:" prop="name">
                <el-input v-model="add_detail_partsForm.name"></el-input>
            </el-form-item>
          </el-form>
        </basedialog>
        <!-- 导入模板 -->
        <basedialog title="火警联网部件导入" width="24%" class="networkreport"  ref="networkreport">
            <div class="networkreport_content"> 
                <p>注：数据导入会覆盖现有记录</p>
                <p><span>防火单位：</span> {{}}</p>
                <p><span>联网设备编号：</span> {{}}</p>
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
                        <el-link href="http://futest.sctsjkj.com/template/消防火警部件编码表.xlsx" type="primary">模板下载</el-link>
                    </div>

                </div>
            </div>
        </basedialog>
  </div>
</template>

<script>
// import bus from '../../../plugins/eventBus'
export default {
    props:{
        floorInfo:{
            type:Number,
            default(){
                return 0
            }
        }
    },
    watch:{
        floorInfo(val){
            console.log("floor_val",val)
            this.floorimg_show = true
            this.activename =''
        }
    },
    data() {
      return {
        floorimg_show:true,//默认显示楼层平面图，false则显示列表
        imageUrl: '',
        activename:'',//右侧被选中的部件文字
        edit_floorForm:{//编辑楼层信息框

        },
        select_title:'火警网关',
        select_value:'',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        columnList:[
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
                label:'操作'
            }
        ],
        tableData:[
            {
                test:'测试'
            }
        ],
        add_detail_partsForm:{//新增部件

        },
        part_fileList:[],
      };
    },
    mounted(){
        console.log('初始化楼层',this.floorInfo)
        //接收兄弟组件传来的值
        // bus.$on('sendByBus_f',data=>{
        //     console.log("楼层id",data)
        // })
    },
    methods: {
        selectbtn(text){
            this.activename = text
            this.select_title =text
            this.floorimg_show =false
        },
        //
        showImg(){
            this.activename = ''
            this.floorimg_show = true
        },
        //编辑
        edit(){
            this.activename = ''
            this.$refs.edit_floorDialog.dialogVisible = true
        },
        //编辑提交
        submit_floor(){

        },
        //删除
        deletefloor(){
            this.activename = ''
            this.$confirm('确认删除楼层吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('deleteData',)
            }).catch(() => {
                    
            });
        },
        //上传成功回调
        handleAvatarSuccess(res, file) {
            console.log("res")
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        uploadIMG(){
            console.log(1)
        },
        // 移除图片
        handleRemove() {
            this.imageUrl = ''
        },
         // 上传前格式和图片大小限制
        beforeAvatarUpload(file) {
            console.log("上传之前",file)
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //新增部件
        add_part(){
             this.$refs.add_detailDialog.dialogVisible = true
        },
        //打开导入部件弹窗
        import_part(){
             this.$refs.networkreport.dialogVisible = true
        },
        //导入部件
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
         handleExceed(){
            this.$notify({
                title: '警告',
                message: '只能上传一个文件哦!,若需要上传其他文件请先移除已选择的文件',
                type: 'warning'
            });
        },
        //上传到服务器数据
        uploadFile(item){
           
         console.log(item)

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
    }
}
</script>

<style lang="less">
    .buildinfo_right_floor{
        padding:0px 20px;
        // width: 100%;
        .btn{
           display: flex;
           justify-content: space-around;
           margin-bottom: 20px;
            .left{
                button{
                    color: #fff;
                    width: 100px;
                    &:nth-child(1){
                        background: #28A745;
                        border-color: #28A745;
                    }
                    &:nth-child(2){
                        background: #409EFF;
                        border-color: #409EFF;
                    }
                    &:nth-child(3){
                        background: #8a8a8a;
                        border-color: #8a8a8a;
                    }
                }
            }
            .right{
                button.isactive{
                    color: white;
                    font-size: 16px;
                }
            }
        }
        .content{
            .avatar-uploader .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
            .List_box{
                .List_top{
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 20px;
                    .left{
                        color: white;
                        span{
                            margin-right: 10px;
                        }
                        input{
                            background: #304F87;
                            color: white;
                            border: none;
                        
                        }
                    }
                    .right{
                        button{
                            color: #fff;
                            width: 100px;
                            &:nth-child(1){
                                background: #28A745;
                                border-color: #28A745;
                            }
                            &:nth-child(2){
                                background: #409EFF;
                                border-color: #409EFF;
                            }
                            &:nth-child(3){
                                background: #409EFF;
                                border-color: #409EFF;
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
                p{
                    line-height: 2;
                }
                .upload-demo{
                    margin: 10px 0px;
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