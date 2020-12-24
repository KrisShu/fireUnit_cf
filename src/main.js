import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import $ from 'jquery'

import './assets/css/reset.css' //引入初始化样式
import './assets/css/baseform.less'

// import echarts from 'echarts'
import * as echarts from 'echarts'; 
Vue.prototype.$echarts = echarts

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);//引入整个ElementUI，全局使用

import './plugins/basecomponent' //引入全局使用的组件

import api from "./plugins/api.js";
import axios from "./plugins/axios.js"

let baseUrl

if(location.hostname == 'localhost'){//开发环境
  baseUrl = '/dev'
  Vue.prototype.$URL = 'http://fu.sctsjkj.com:5082'
  Vue.prototype.$noportURL = `http://fu.sctsjkj.com`
}else{//线上环境或者测试环境
  baseUrl = `http://${location.hostname}:5082`
  Vue.prototype.$URL = baseUrl
  Vue.prototype.$noportURL = `http://${location.hostname}`
}

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
axios.defaults.baseURL= baseUrl

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
