<template>
  <div>
       <el-button type="primary" @click="g">主要按钮</el-button>
  </div>
</template>

<script>
export default {
    methods:{
        g(){
            this.$router.push(
                {
                    name:'index'
                }
            )
        }
    }
}
</script>

<style>

</style>