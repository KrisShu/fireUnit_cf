import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
 
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path:'/',
    name:'index',
    component:()=>import('../views/Home/index.vue'),
    children:[
        {
            path:'/',
            name:'supervise',
            component:()=>import('../views/Home/supervise.vue'),
        },
        {
            path:'network',
            name:'network',
            component:()=>import('../views/Home/PoliceHandel/network.vue'),
        },
        {
            path:'infomations',
            name:'infomations',
            component:()=>import('../views/Home/PoliceHandel/infomations.vue'),
        },
        

      // ----------------
      {
          path:'Inhalation_gateway',
          name:'Inhalation_gateway',
          component:()=>import('../views/Home/facilities/Inhalation_gateway.vue'),
      },
      {
          path:'combustibleGas_gateway',
          name:'combustibleGas_gateway',
          component:()=>import('../views/Home/facilities/combustibleGas_gateway.vue'),
      },
      {
          path:'electricalFire_gateway',
          name:'electricalFire_gateway',
          component:()=>import('../views/Home/facilities/electricalFire_gateway.vue'),
      },
      {
          path:'waterSupply_level_gateway',
          name:'waterSupply_level_gateway',
          component:()=>import('../views/Home/facilities/waterSupply_level_gateway.vue'),
      },
      {
          path:'waterSupply_pressure_gateway',
          name:'waterSupply_pressure_gateway',
          component:()=>import('../views/Home/facilities/waterSupply_pressure_gateway.vue'),
      },
      {
          path:'pump_gateway',
          name:'pump_gateway',
          component:()=>import('../views/Home/facilities/pump_gateway.vue'),
      },
      //----------
      {
          path:'Inspection',
          name:'Inspection',
          component:()=>import('../views/Home/work/Inspection.vue'),
      },
      {
          path:'Troubleshooting',
          name:'Troubleshooting',
          component:()=>import('../views/Home/work/Troubleshooting.vue'),
      },
      //----------
      {
          path:'baseInfo',
          name:'baseInfo',
          component:()=>import('../views/Home/management_info/baseInfo.vue'),
      },
      {
          path:'buildInfo',
          name:'buildInfo',
          component:()=>import('../views/Home/management_info/buildInfo.vue'),
      },
      {
          path:'staffInfo',
          name:'staffInfo',
          component:()=>import('../views/Home/management_info/staffInfo.vue'),
      },
      {
          path:'updatepassword',
          name:'updatepassword',
          component:()=>import('../views/Home/management_info/updatepassword.vue'),
      },

      

    ]
  },
  {
    path: '/MakeMark',
    name: 'MakeMark',
    component: () => import('../views/Home/management_info/MakeMark.vue')
  },
]

const router = new VueRouter({
  routes
})


router.beforeEach(function(to, from, next) {

  if (!localStorage.getItem("islogin")) {
      if (to.path !== '/login') {
          return next('/login')
      }
  }
  next()
})
export default router
