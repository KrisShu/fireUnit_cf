<template>
    <div class="basescreenbtn_add">
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
            <el-button @click="add" icon="el-icon-circle-plus-outline" type="primary">新增</el-button>
    </div>
</template>

<script>
export default {
    props:{
        top_screen_btn:{
            type:Array,
            default(){
                return []
            }

        }
    },
    data(){
        return{
            top_screen_flag:'全部'
        }
    },
    methods:{
        //顶部筛选
        topScreen(text){
            this.$emit('topScreen',text)
            this.top_screen_flag =text
        },
        //新增
        add(){
            this.$emit('add')
        }
    }
}
</script>

<style lang="less">
    .basescreenbtn_add{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .BTNS{
            display: flex;
            align-items: center;
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
                &.gary{
                    background: #c0c0c0;
                }
                &.orange{
                    background: #DC3545;
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

    }
</style>