import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import $ from 'jquery'

import './assets/css/reset.css' //引入初始化样式
import './assets/css/baseform.less'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);//引入整个ElementUI，全局使用

import './plugins/basecomponent' //引入全局使用的组件

import api from "./plugins/api.js";
import axios from "./plugins/axios.js"

console.log("this.路径",window.location.href)
const href = window.location.href
let arr  = href.split("#")
let axiosurl = arr[0]
axiosurl = axiosurl.substr(0,axiosurl.length-1)
console.log("最终拼接的axiosurl",axiosurl)

let axiosurl1 = `${axiosurl}:5082/`

store.commit('setaxiosurl',axiosurl1)

let axiosurl2 = `${axiosurl}:5082`
let axiosurl3 = `${axiosurl}`


axios.defaults.baseURL= axiosurl1
Vue.prototype.$api = api;

Vue.prototype.$axios = axios;


// Vue.prototype.$URL = 'http://fu.sctsjkj.com:5082';
Vue.prototype.$URL = axiosurl2
Vue.prototype.$exportURL = axiosurl3

if(localStorage.getItem('userinfo')){
  let info = JSON.parse(localStorage.getItem("userinfo"));
  store.commit("setUserInfo", info);
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
