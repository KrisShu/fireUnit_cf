
<template>
  <div id="asideMenu">
    <el-scrollbar style="height:100%">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu 
            @select="changePath" 
            :unique-opened="true" 
            :default-active="menuActive" 
            class="el-menu-vertical-demo"  
          >
            <el-menu-item index="supervise">
              <span slot="title">消防作业监督管理</span>
            </el-menu-item>
            
            <el-submenu index="one">
              <template slot="title">
                <span>消防联网警情处置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,x) in onemenuList" :key="x" :index="item.url">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu v-if="$store.state.userInfo.role != '消防值班员'" index="two">
              <template slot="title">
                <span>消防联网设施管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,x) in twomenuList" :key="x" :index="item.url">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!--消防作业管理  -->
            <el-submenu index="three">
              <template slot="title">
                <span>消防作业管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,x) in threeMenuList" :key="x" :index="item.url">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu v-if="$store.state.userInfo.role != '消防值班员' " index="four">
              <template slot="title">
                <span>消防单位信息管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,x) in fourMenuList" :key="x" :index="item.url">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>

export default {
  data(){
    return{
        menuActive:'supervise',
        onemenuList:[
            {
                url:'network',
                name:'联网报警',
            },
            {
                url:'infomations',
                name:'管理信息',
            },
        ],
        twomenuList:[
            {
                url:'Inhalation_gateway',
                name:'吸入式火警网关',
            },
            {
                url:'combustibleGas_gateway',
                name:'可燃气体网关',
            }, 
            {
                url:'electricalFire_gateway',
                name:'电气火灾网关',
            },
            {
                url:'waterSupply_level_gateway',
                name:'消防供水液位',
            },
            {
                url:'waterSupply_pressure_gateway',
                name:'消防供水压力',
            },
            {
                url:'pump_gateway',
                name:'启泵部件管理',
            }
        ],
        threeMenuList:[
            {
                url:'Inspection',
                name:'消防巡查',
            },
            {
                url:'Troubleshooting',
                name:'故障处理',
            }
        ],
        fourMenuList:[
            {
                url:'baseInfo',
                name:'基本信息',
            },
            {
                url:'buildInfo',
                name:'建筑信息',
            },
            {
                url:'staffInfo',
                name:'工作人员',
            },
            {
                url:'updatepassword',
                name:'修改密码',
            }
        ]
     
    }
    
  },
  methods:{
    /* 菜单跳转 */
    changePath(index){
      console.log(index)
      this.$router.push({
        name:index
      })
    }
  },
  created: function() {
    this.menuActive = this.$route.name;
    
  },
};
</script>


<style lang="less">
@hoverBg:#025691;
#asideMenu{
    height: 100%;
    overflow: hidden;
    .el-scrollbar {
        height: 100%;
        width: 100%;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    
    .el-submenu__title{
        padding: 0px !important;
        i{
            color: white;
        }
    }
    .el-menu-item{
        padding: 0px;
        height: 62px;
        line-height: 62px;
        span{
            color: #fff;
            font-size: 16px;
        }
        &.is-active {
          background-color:@hoverBg !important;
        }
        &:hover{
            background: @hoverBg;
        }
        &:focus{
            background: @hoverBg;
        }
        
    }
  
    .el-submenu__title{
        &:hover{
            background: @hoverBg;
        }
        span{
            color: #fff;
            font-size: 16px;
            margin-left: 18px;
        }
    }
 
    .el-submenu .el-menu-item{
      min-width: 160px;
      color: white;
      font-size: 14px;
    }

  
}
</style>


