<template>
    <div class="buildInfo">
        <buildInfoleft @handleNodeClick="handleNodeClick"></buildInfoleft>
        <buildinforightbuild :buildInfo="buildInfo"  v-if="buildinfoshow"></buildinforightbuild>
        <buildinforightfloor :floorInfo="floorInfo" v-else></buildinforightfloor>
        
        
    </div>
</template>

<script>
import buildInfoleft from './buildInfo_left';
import buildinforightbuild from './buildinfo_right_build'
import buildinforightfloor from './buildinfo_right_floor'
export default {
    components:{
        buildInfoleft,
        buildinforightbuild,
        buildinforightfloor
    },
    data() {
      return {
        buildInfo:0,
        floorInfo:0,
        buildinfoshow:true,//是否右侧显示建筑信息，true则显示建筑信息，false则显示楼层信息
      };
    },
    methods: {
      handleNodeClick(obj) {
        
        if(obj.floors){
            this.buildinfoshow = true
            this.buildInfo = obj.id
            // console.log('父节点')
        }else{
            this.buildinfoshow = false
            this.floorInfo = obj.id
            console.log('子节点')
        }
      },
      add(){

      }
    }
}
</script>

<style lang="less">
    .buildInfo{
        height: 100%;
        display: flex;
        &>:nth-child(2){
            flex: 2 0 auto;
        }
    }
</style>