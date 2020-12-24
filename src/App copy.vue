<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
let moment = require('moment');
export default {
  created(){
    

      setInterval(() => {
            setTimeout(()=>{
                    this.GetDefaultPageDataList();
                    // this.GetDefaultPageDataList();
            })
      }, 5000)
  },
  methods:{
      GetDefaultPageDataList(){
            // console.log(moment().format('YYYY-MM-DD hh:mm:ss'));
            this.$axios.get(this.$api.GetDefaultPageDataList,{params:{num:10}}).then(res=>{
                this.DefaultPageDataList = res.result
                if( !localStorage.getItem('timestamp_Alarm')){//第一不存在数据
                    localStorage.setItem('timestamp_Alarm',+res.result.timestamp_Alarm)
                    localStorage.setItem('timestamp_Fault',+res.result.timestamp_Fault)
                    localStorage.setItem('timestamp_Gateway',+res.result.timestamp_Gateway)
                }
                let audio = new Audio()
                

                if(res.result.timestamp_Alarm != localStorage.getItem('timestamp_Alarm')){
                        
                        audio.src = "http://fu.sctsjkj.com/voice/fire.wav"
                        audio.play();

                    localStorage.setItem('timestamp_Alarm',+res.result.timestamp_Alarm)
                }
                
                if(res.result.timestamp_Fault != localStorage.getItem('timestamp_Fault')){
                    audio.src = "http://fu.sctsjkj.com/voice/fault.wav"
                    audio.play();
                    localStorage.setItem('timestamp_Fault',+res.result.timestamp_Fault)
                }
                if(res.result.timestamp_Gateway != localStorage.getItem('timestamp_Gateway')){
                    audio.src = "http://fu.sctsjkj.com/voice/GatewayOffline.wav"
                    audio.play();
                    localStorage.setItem('timestamp_Gateway',+res.result.timestamp_Gateway)
                }
            })
        },
  }
}
</script>

<style lang="less">
</style>


