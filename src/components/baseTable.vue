<template>
   <div class="base-table">
        <el-table
        :data="tableData"
        style="width: 100%">
            <el-table-column
                show-overflow-tooltip
                v-for="(item, index) in columnList"
                :width="item.width"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :align="item.align ? item.align : 'center'"    
            >
                <template slot-scope="scope">
                    <div v-if="item.label == '操作' && tableName == 'network'">
                        <el-button
                            @click="getlocation(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-location-information"
                        >定位</el-button>
                        <el-button
                            @click="check(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-warning-outline"
                        >核警</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'infomations'">
                        <el-button
                            @click="getlocation(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-location-information"
                        >定位</el-button>
                    </div>
                    <!--  -->
                    <div v-else-if="item.label == '操作' && tableName == 'gateway'">
                        <el-button
                            @click="getnetworkList(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-bank-card"
                        >联网部件</el-button>
                        <el-button
                            @click="getdetails(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-tickets"
                        >详情</el-button>
                        <el-button
                            @click="deleteData(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                        >删除</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'pump'">
                        <el-button
                            @click="deleteData(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                        >删除</el-button>
                    </div>
                    <!--  -->
                    <div v-else-if="item.label == '故障部件' && tableName == 'gateway'">
                        <el-button
                            @click="getfault(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-search"
                        >{{ scope.row[item.prop] }}</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'willdeal'">
                        <el-button
                            @click="deal(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-edit-outline"
                        >处理</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'dealed'">
                        <el-button
                            @click="dealdetail(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-edit-outline"
                        >处理详情</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'detail_delete'">
                        <el-button
                            @click="getdetails(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-tickets"
                        >详情</el-button>
                        <el-button
                            @click="deleteData(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                        >删除</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'waterSupply_level_gateway'">
                        <el-button
                            @click="getdetails(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-tickets"
                        >详情</el-button>
                        <el-button
                            @click="showtrend(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-data-line"
                        >趋势</el-button>
                        <el-button
                            @click="deleteData(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                        >删除</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'staffInfo'">
                        <el-button
                            @click="getdetails(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-tickets"
                        >详情</el-button>
                        <el-button
                            @click="resetpassword(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-tickets"
                        >重置密码</el-button>
                        <el-button
                            @click="deleteData(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                        >删除</el-button>
                    </div>
                    <div v-else-if="item.label == '操作' && tableName == 'makemark'">
                        <el-button
                            @click="makemark(scope)"
                            size="mini"
                            type="text"
                        >{{specailText}}</el-button>
                    </div>
                  
                    <span v-else-if="item.prop == 'checkState'" >
                        {{ scope.row[item.prop] | checkState }}
                    </span>
                    <span v-else-if="item.prop == 'patrolStatus'" >
                        {{ scope.row[item.prop] | patrolStatus }}
                    </span>
                    <span :class="dealStatusClass(scope.row[item.prop])" v-else-if="item.prop == 'gatewayStatus'" >
                        {{ scope.row[item.prop] | dealStatus }}
                    </span>
                    <span v-else-if="item.prop == 'state'" >
                        {{ scope.row[item.prop] | waterstate }}
                    </span>
                    <!-- 时间处理 -->
                    <span v-else-if="item.prop == 'creationTime' || item.prop == 'faultTime' || item.prop == 'handleTime'" >
                        {{ scope.row[item.prop] | dealTime }}
                    </span>
                     <!-- 点位坐标 -->
                    <div v-else-if="item.prop == 'coordinateX'">
                           <p>X:{{scope.row[item.prop]}}</p>
                           <p>Y:{{scope.row[item.prop1]}}</p>
                    </div>
                    <!--  -->
                    <div v-else-if="item.label == '趋势'">
                        <el-button
                            @click="showtrend(scope)"
                            size="mini"
                            type="text"
                            icon="el-icon-data-line"
                        >查看</el-button>
                    </div>
                    <span v-else >{{ scope.row[item.prop] | capitalize(item) }}</span>
                </template>
            </el-table-column>
        </el-table>
   </div>
</template>

<script>
export default {
    props:{
        columnList: {
            type: Array,
            require: true
        },
        tableData: {
            type: Array,
            require: true
        },
        tableName:{
            type:String,
        },
        specailText:{
            type:String,
            default:'查看'
        }
    },
    //过滤器
    filters: {
        checkState:(val)=>{
            if(val == 1){
                return '未核警'
            }else if(val == 2){
                 return '误报'
            }else if(val == 3){
                 return '测试'
            }else if(val == 4){
                 return '真实'
            }
        },
        //状态处理
        dealStatus:(val)=>{
            if(val == 1){
                return '在线'
            }else if(val == -1){
                 return '离线'
            }
        },
        waterstate:(val)=>{
            if(val == 1){
                return '正常'
            }else if(val == 2){
                 return '故障'
            }else if(val == 3){
                 return '屏障'
            }else if(val == 4){
                 return '超限'
            }else if(val == -1){
                 return '离线'
            }
        },
        patrolStatus:(val)=>{
            if(val == 1){
                return '正常'
            }else if(val == 2){
                 return '发现问题并解决'
            }else if(val == 3){
                 return '发现问题未解决'
            }
        },
        //时间格式处理
        dealTime:(val)=>{
            if(val){
                var str = val.split('T');
                var str2 = str[1].split(".")
                var timestr = str[0] +" "+ str2[0]
                return timestr;
            }
           
        },
        //过滤掉没有数据的或数据为空的 显示-
        capitalize: function(val, item) {
            return val ? `${val}${item.unit ? item.unit : ""}` : "—";
        }
    },
    methods:{
        dealStatusClass(val){
            if(val == 1){
                return 'green'
            }else if(val == -1){
                 return 'gary'
            }
        },
        check(scope){
            this.$emit('check',scope.row)
        },
        //打开定位弹窗
        getlocation(scope){
            this.$emit('getlocation',scope.row)
        },
        //打开详情弹窗
        getdetails(scope){
            this.$emit('getdetails',scope.row)
        },
        //打开故障部件弹窗
        getfault(scope){
            this.$emit('getfault',scope.row)
        },
        //打开联网部件列表
        getnetworkList(scope){
            this.$emit('getnetworkList',scope.row)
        },
        //处理
        deal(scope){
             this.$emit('deal',scope.row)
        },
        //处理详情
        dealdetail(scope){
            this.$emit('dealdetail',scope.row)
        },
        //删除数据
        deleteData(scope){
        
            this.$confirm('确认删除该数据吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('deleteData',scope.row)
            }).catch(() => {
                    
            });
        },
        //重置密码
        resetpassword(scope){
            this.$confirm('确认重置密码吗？', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('resetpassword',scope.row)
            }).catch(() => {
                    
            });
        },
        makemark(scope){
            this.$emit('makemark',scope)
        },
        //查看趋势
        showtrend(scope){
            this.$emit('showtrend',scope.row)
        }

    }
}
</script>

<style lang="less">
    .base-table{
        background: #0E4878;
        .el-table th {
            background-color:#167FC1;
            color: white;
        }
        tbody {
            td{
                color: white;
                .cell{
                     line-height: 40px;
                }
            }
            tr:nth-of-type(odd) {
                background-color: #0E4878;
            }
            tr:nth-of-type(even){
                background: #11335B;
            }
            .el-button--text{
                color: #00e4ff !important;
            }
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #167fc1 !important;
        }
        .el-table__empty-block {
            background-color: #0e4878;
        }
        .cursor{
            cursor: pointer;
        }
        .yellow{
            color: #E6A23C;
        }
        .lightBlue{
            color: rgb(116, 220, 255);
        }
        .orange{
            color: #F56C6C;
        }
        .green{
            color: #28A745;
        }
        .gary{
            color: rgb(216, 213, 213);
        }

        ul{
            li{
                span.cursor{
                    margin-left: 6px;
                    text-decoration: underline;
                     
                }
                p{
                    line-height: normal;
                }
               
            }
        }
        .BitMap{
            color: rgb(94, 187, 241) !important;
            margin-left: 20px;
        }

    }
    
</style>