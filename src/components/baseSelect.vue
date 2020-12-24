<template>
  <div class="network">
        <div class="selectform">
            <el-form :inline="true" :model="selectform" class="demo-form-inline">
                <el-form-item label="建筑">
                    <el-select v-model="selectform.ArchitectureId" placeholder="建筑">
                    <el-option 
                    v-for="arr in ArchitectureList"
                    :key="arr.id"
                    :label="arr.name" 
                    :value="arr.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部件编号">
                    <el-input clearable v-model="selectform.DetectorSn" placeholder="部件编号"></el-input>
                </el-form-item>
                <el-form-item label="核警状态" v-if="flag">
                    <el-select v-model="selectform.CheckState" placeholder="核警状态">
                    <el-option label="全部"   :value="0"></el-option>
                    <el-option label="未核警" :value="1"></el-option>
                    <el-option label="误报"  :value="2"></el-option>
                    <el-option label="测试"  :value="3"></el-option>
                    <el-option label="真实"  :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件" v-else>
                    <el-select v-model="selectform.ManagerInfo" placeholder="事件">
                    <el-option 
                    v-for="(arr,index) in ManagerInfo_Dropdown"
                    :key="index"
                    :label="arr" 
                    :value="arr"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
  </div>
</template>

<script>
export default {
    props:{
        flag:{
            type:Boolean,
            default(){
                return true
            }
        }
    },
    data(){
        return{
        selectform:{
            ArchitectureId:'',
            CheckState:0,
            ManagerInfo:'全部'
        },
        FireUnitId :this.$store.state.userInfo.fireUnitID,
        ArchitectureList:[],//所有建筑
        ManagerInfo_Dropdown:[],//管理信息事件选择项
        }
    },
    created(){
        this.GetManagerInfo_Dropdown(this.FireUnitId)
        this.GetArchitectureList(this.FireUnitId)
    },
    methods:{
        onSubmit(){
            console.log(this.selectform)
            this.$emit('select',this.selectform)
        },
        GetArchitectureList(FireUnitId){
            this.$axios.get(this.$api.GetArchitectureList,{params:{FireUnitId}}).then(res=>{
                this.ArchitectureList = res.result
                let obj = {
                name :'全部',
                id:''
                }
                this.ArchitectureList.unshift(obj)
            })
        },
        //获取管理信息的事件的选择项
        GetManagerInfo_Dropdown(FireUnitId){
            this.$axios.get(this.$api.GetManagerInfo_Dropdown,{params:{FireUnitId}}).then(res=>{
                this.ManagerInfo_Dropdown = res.result;
                this.ManagerInfo_Dropdown.unshift('全部')
            })
        }
    }
}
</script>

<style>

</style>