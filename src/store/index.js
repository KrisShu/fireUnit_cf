import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{},
    buildID:0,
    axiosurl:''
  },
  mutations: {
    setUserInfo(state, payload = {}) {
      state.userInfo = payload ? payload : {};
    },
    //保存建筑id
    setbuildID(state,id) {
      state.buildID = id;
    },
    setaxiosurl(state,url){
      state.axiosurl = url
    }
  },
  actions: {
  },
  modules: {
  }
})
