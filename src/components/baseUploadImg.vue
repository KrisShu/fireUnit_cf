<template>
  <div class="uploadimg">

      <div
        @mouseenter="enter" 
        @mouseleave="leave"
        v-if="uploadImgsrc" 
      >
            <el-image 
                :style="{width: imgWidth,height: imgHeight}" 
                :src="uploadImgsrc" 
                fit="cover" 
            >
            </el-image>
            <div  v-if="show" class="Mantle">
                <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview"
                >
                    <i class="el-icon-zoom-in"></i>
                </span>
                <span
                    class="el-upload-list__item-preview"
                    @click="handleRemove"
                >
                    <i class="el-icon-delete"></i>
                </span>
            </div>
      </div>
   
    <!-- 如果没有点击上传获取图片 -->
    <div class="noImg" v-else>
        <img :src="uploadimgIocn" alt="">
    </div>
    
   
    <el-button  @click="openFile">{{uploadimgtext}}</el-button>
    <input type="file" ref="uploadInput" @change="upload">
    <el-dialog   title="图片" :visible.sync="dialogVisible">
        <img width="100%" :src="uploadImgsrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
   
    props:{
        showimgurl:String,//详情展示的图片
        imgWidth:{
            type:String,
            default(){
                return '200px'
            }
        },
        imgHeight:{
            type:String,
            default(){
                return '200px'
            }
        },
        uploadimgtext:{
            type:String,
            default :'上传图片'
        }
    },
    data(){
        return{
            uploadimgIocn:require("../assets/images/upload.png"),
            uploadImgsrc:'',//选择的图片
            show:false,
            dialogVisible:false,//弹窗是否显示
        }
    },
    watch:{
      showimgurl(val){
          console.log("showimgurl",val)
          this.uploadImgsrc = val
      }
    },
    methods:{
        enter(){
            this.show = true
        },
        leave(){
            this.show = false
        },
        //点击查看大图
        handlePictureCardPreview(){
            this.dialogVisible = true

        },
        handleRemove(){
           this.uploadImgsrc =''
           this.$emit('getuploadimgfile','')//将拿到file文件对象传给父组件
        },
        openFile(){
            let input = this.$refs.uploadInput
            input.click();
        },
        upload(){
            let input = this.$refs.uploadInput
            let imgFile = input.files[0]; //拿到的图片文件
            this.$emit('getuploadimgfile',imgFile)//将拿到file文件对象传给父组件
            // console.log("拿到的图片文件imgFile",imgFile)
            this.fileToBase64(imgFile).then(res=>{
                this.uploadImgsrc = res
            })
            
        },
        fileToBase64(file){
            let
            reader = new FileReader();
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
        }

    }
};
</script>

<style lang="less">
    .uploadimg{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        .Mantle{
            width: 200px;
            height: 200px;
            background: rgba(66, 66, 66, 0.8);
            position: absolute;
            // z-index: 199;
            top: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: white;
        }
        .noImg{
            width: 200px;
            height: 200px;
            border: 1px solid skyblue;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .el-button{
            width: 300px;
            margin-top: 30px;
            background: rgb(1, 0, 80);
            color:white;
        }
        input{
            display: none;
        }
    }
</style>