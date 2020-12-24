<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :width="width"
        :before-close="handleClose"
    >
       
            <slot>
            


            </slot>
        
        <div v-if="footershow" slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:'标题'
        },
        footershow:{
            type:Boolean,
            default(){
                return false
            }
        },
        width:{
            type:String,
            default:'30%'
        },
        footer_dialogVisible:{
            type:Boolean,
            default(){
                return false
            }
        }
    },
    data(){
        return{
            dialogVisible:false
        }
    },
    methods:{
        //关闭弹出
        handleClose(){
            this.dialogVisible =false
        },
        cancel(){
            this.dialogVisible = false;
            this.$emit('cancel')
        },
        //确定
        submit(){
            if(this.footer_dialogVisible){
                this.dialogVisible = false;
            }
            
            this.$emit('submit')
        }
        
    }
}
</script>

<style lang="less">
    .el-dialog{
        color: white;
        border: 1px solid #007ED8;
        border-radius: 8px;
        .el-dialog__header{
            background: #020D1C;
            border-bottom: 1px solid #007ED8;
            text-align: center;
            font-family:'Times New Roman', Times, serif;
            font-weight: bold;
            .el-dialog__title{
                color: white;
                text-align: center;
            }
            .el-dialog__close{
                font-size: 20px;
                font-weight: bold;
                color: white;
                &:hover{
                  
                    color: #E45262;
                }
            }
        }
        .el-dialog__body{
            background:#020D1C;
           
            .el-scrollbar {
                height: 100%;
                width: 100%;
                .el-scrollbar__thumb{
                    background-color: rgb(255 255 255 / 30%);
                }
            }
            .el-scrollbar__wrap {
                overflow-x: hidden;
                .el-scrollbar__view{
                    margin-bottom: 34px;
                }
            
            }
            

        }
        .el-dialog__footer{
            display: flex;
            justify-content: center;
            background: #020D1C;
            border-top: 1px solid #007ED8;
            .el-button{
                background: gainsboro;
                &:nth-of-type(2){
                    background:#409EFF ;
                }
            }

        }
    }
</style>