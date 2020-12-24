<template>
    <el-container class="dataIndex">
        <el-header style="height:78px">
            <baseHeader></baseHeader>
        </el-header>
        <el-container>
            <el-aside width="220px">
                <baseAisde></baseAisde>
            </el-aside>
            <el-main>
                <el-scrollbar>
                  <router-view></router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import baseHeader from '../../components/baseHeader'
import baseAisde from '../../components/baseAisde';
export default {
    components:{
        baseHeader,
        baseAisde
    }
}
</script>

<style lang="less">
.border{
    border-image:url("../../assets/images/home_img_bg.png") 22 24 repeat stretch;
    border-style: solid;
    border-width: 12px 12px;
}
    .dataIndex{
        height: 100vh;
        padding-bottom: 4px;
         >.el-container{
            overflow: hidden;
            .el-aside{
                background: #020d1c;
                .border();
                .el-menu{
                    background: none;
                    border: none;
                }
            }
            > .el-main{
                background: #020d1c;
                margin-left: 14px;
                height: 100%;
                .border();
                padding: 0;
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
            }
        }
    }
</style>