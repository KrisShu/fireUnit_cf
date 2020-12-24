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
            })
        },5000)
  },
  mounted(){
        // let audio1 = new Audio()
        // audio1.src = `${this.$noportURL}/voice/fire.wav`
        // audio1.play();
        // console.log(audio1)
  },
  methods:{
      GetDefaultPageDataList(){
            // console.log(moment().format('YYYY-MM-DD hh:mm:ss'));
            this.$axios.get(this.$api.GetDefaultPageDataList,{params:{num:10}}).then(res=>{
                if( !localStorage.getItem('timestamp_Alarm')){//第一不存在数据
                    localStorage.setItem('timestamp_Alarm',+res.result.timestamp_Alarm)
                    localStorage.setItem('timestamp_Fault',+res.result.timestamp_Fault)
                    localStorage.setItem('timestamp_Gateway',+res.result.timestamp_Gateway)
                }
                
                

                if(res.result.timestamp_Alarm != localStorage.getItem('timestamp_Alarm')){
                    let audio1 = new Audio()
                    audio1.src = `${this.$noportURL}/voice/fire.wav`
                    audio1.play();
                    localStorage.setItem('timestamp_Alarm',+res.result.timestamp_Alarm)
                    
                    // console.log('11111-播放',`${this.$noportURL}/voice/fire.wav`)
                }else{
                    //  console.log("111111-不播放")
                    // audio.pause();
                }
                
                if(res.result.timestamp_Fault != localStorage.getItem('timestamp_Fault')){
                    let audio2 = new Audio()
                    audio2.src =  `${this.$noportURL}/voice/fault.wav`
                    audio2.play();
                    localStorage.setItem('timestamp_Fault',+res.result.timestamp_Fault)

                    // console.log('22222-播放',`${this.$noportURL}/voice/fault.wav`)
                }else{
                    //  console.log("22222-不播放")
                    // audio.pause();
                }

                if(res.result.timestamp_Gateway != localStorage.getItem('timestamp_Gateway')){
                    let audio3 = new Audio()
                    audio3.src =    ` ${this.$noportURL}/voice/GatewayOffline.wav`
                    audio3.play();
                    localStorage.setItem('timestamp_Gateway',+res.result.timestamp_Gateway)

                    // console.log('33333-播放',`${this.$noportURL}/voice/fault.wav`)
                }else{
                    //  console.log("33333-不播放")
                    // audio.pause();
                }
            })
        },
  }
}
</script>

<style lang="less">
</style>


