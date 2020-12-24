const API = {
    UserLogin:'/api/services/app/FireUnitUser/UserLogin',//用户登录
    UserLogout:'/api/services/app/FireUnitUser/UserLogout',//注销用户


    //消防作业监督管理
    GetDefaultPageDataList:'/api/services/app/Alarm/GetDefaultPageDataList',// 获取首页全部列表数据

    GetFloorDropdown:'/api/services/app/Architecture/GetFloorDropdown',// 获取某个建筑下的楼层
    GetArchitectureList:'/api/services/app/Architecture/GetArchitectureList',// 获取某个防火单位的所有建筑（下拉选择框）
    GetDetectorInfo:'/api/services/app/Detector/GetDetectorInfo',// 获取单个联网部件信息
    CheckAlarm :'/api/services/app/Alarm/CheckAlarm',// 警情核警
    HandleFault:'/api/services/app/FaultDetector/HandleFault',//处理故障

    //消防联网警情处置
    
    //--联网报警---
    GetAlarmList:'/api/services/app/Alarm/GetAlarmList',// 获取报警数据列表
    GetAlarmCheckInfo:'/api/services/app/Alarm/GetAlarmCheckInfo',// 获取核警说明
    CheckAlarm:'/api/services/app/Alarm/CheckAlarm',// 警情核警
    GetDetectorInfo:'/api/services/app/Detector/GetDetectorInfo',// 获取单个联网部件信息



    //--管理信息--
    GetManagerInfo_Dropdown:'/api/services/app/ManagerInfo/GetManagerInfo_Dropdown',// 获取管理信息事件查询下拉框所需的事件数组
    GetManagerInfoList:'/api/services/app/ManagerInfo/GetManagerInfoList',// 获取管理信息数据列表
    GetDetectorInfo:'/api/services/app/Detector/GetDetectorInfo',// 获取单个联网部件信息

    //消防联网设施管理

    //-吸入式火警网关--
    AddGateway:'/api/services/app/Gateway/AddGateway',// 添加网关
    UpdateGateway:'/api/services/app/Gateway/UpdateGateway',//修改网关
    GetGatewayStatusNum:'/api/services/app/Gateway/GetGatewayStatusNum',// 获取网关在线、离线数量
    GetGatewayList:'/api/services/app/Gateway/GetGatewayList', //获取网关列表
    GetGatewayInfo:'/api/services/app/Gateway/GetGatewayInfo',// 获取单个网关信息
    DeleteGateway:'/api/services/app/Gateway/DeleteGateway',// 删除网关
    GetDetectorListByGateway:'/api/services/app/Detector/GetDetectorListByGateway',// 根据网关获取联网部件列表


    //---
    AddPump:'/api/services/app/PumpDetector/AddPump',//新增启泵部件数据
    GetPumpList:'/api/services/app/PumpDetector/GetPumpList',//获取启泵部件列表
    DeletePump:'/api/services/app/PumpDetector/DeletePump',//删除启泵部件数据



   


    //-----------消防供水液位和压力-----------
    AddGateway_water:'/api/services/app/WaterGateway/AddGateway',//添加设备
    UpdateGateway_water:'/api/services/app/WaterGateway/UpdateGateway',// 修改设备
    GetWaterGatewayInfo:'/api/services/app/WaterGateway/GetWaterGatewayInfo',// 获取单个消防供水设备信息
    GetWaterDetectorList:'/api/services/app/WaterGateway/GetWaterDetectorList',// 获取消防供水设备列表
    DeleteGateway_water:'/api/services/app/WaterGateway/DeleteGateway',// 删除设备
    GetWaterGatewayStatusNum:'/api/services/app/WaterGateway/GetWaterGatewayStatusNum',// 获取消防供水设备各状态数


    

    //消防作业管理

    //--消防巡查--
    Add_Patrol:'/api/services/app/Patrol/Add',//添加巡查记录
    GetPatrolList:'/api/services/app/Patrol/GetPatrolList',//获取巡查记录列表
    GetPatrolStatusNum:'/api/services/app/Patrol/GetPatrolStatusNum',//获取巡查记录各状态数量
    GetPatrolInfo:'/api/services/app/Patrol/GetPatrolInfo',//获取巡查记录详情
    Update_Patrol:'/api/services/app/Patrol/Update',//修改巡查记录

    //--故障处理--
    GetFaultDetectorNoHandleList:'/api/services/app/FaultDetector/GetFaultDetectorNoHandleList',//获取待处理联网设施故障
    GetFaultDetectorHandledList:'/api/services/app/FaultDetector/GetFaultDetectorHandledList',//获取已处理联网设施故障
    GetFaultPatrolNoHandleList:'/api/services/app/FaultDetector/GetFaultPatrolNoHandleList',//获取待处理消防巡查故障
    GetFaultPatrolHandledList:'/api/services/app/FaultDetector/GetFaultPatrolHandledList',//获取已处理消防巡查故障
    HandleFault:'/api/services/app/FaultDetector/HandleFault',//处理故障


    //消防单位信息管理

    //基本信息
    GetFireUnitCard:'/api/services/app/FireUnit/GetFireUnitCard',//获取防火单位熟悉卡详情
    UpdateFireUnitCard:'/api/services/app/FireUnit/UpdateFireUnitCard',//修改防火单位熟悉卡


    //建筑信息
    AddArchitecture:'/api/services/app/Architecture/AddArchitecture',//添加建筑
    GetArchitectureById:'/api/services/app/Architecture/GetArchitectureById',//获取单个建筑信息
    UpdateArchitecture:'/api/services/app/Architecture/UpdateArchitecture',//修改建筑
    DeleteArchitecture:'/api/services/app/Architecture/DeleteArchitecture',//删除建筑
    AddFloor:'/api/services/app/Architecture/AddFloor',//添加楼层
    GetFloorById:'/api/services/app/Architecture/GetFloorById',//获取单个楼层信息
    SubmitFloorPicture:'/api/services/app/Architecture/SubmitFloorPicture',//修改楼层平面图
    UpdateFloor:'/api/services/app/Architecture/UpdateFloor',//修改楼层
    DeleteFloor:'/api/services/app/Architecture/DeleteFloor',//删除楼层
    GetArchitectureTreeByFireUnitId:'/api/services/app/Architecture/GetArchitectureTreeByFireUnitId',//获取某个防火单位的所有建筑和楼层（常用于建筑树状展示）
    GetGatewayDropdown:'/api/services/app/Gateway/GetGatewayDropdown',//获取某个建筑关联的网关设施（下拉选择框）
    AddDetector:'/api/services/app/Detector/AddDetector',//添加联网部件
    GetDetectorListByFloor:'/api/services/app/Detector/GetDetectorListByFloor',//根据楼层获取联网部件列表
    GetDetectorInfo:'/api/services/app/Detector/GetDetectorInfo',//获取单个联网部件信息
    UpdateDetector:'/api/services/app/Detector/UpdateDetector',//修改联网部件
    DeteleDetector:'/api/services/app/Detector/DeleteDetector',//删除联网部件
    ImportDetector:'/api/services/app/Detector/ImportDetector',//导入联网部件

    GetBitMapSet:'/api/services/app/Detector/GetBitMapSet',//获取楼层的火警点位图设置
    
    UpdateDetectorCoordinate:'/api/services/app/Detector/UpdateDetectorCoordinate',//修改部件在点位图上的坐标


    //--工作人员--
    AddUser:'/api/services/app/FireUnitUser/AddUser',//添加工作人员
    GetUserList:'/api/services/app/FireUnitUser/GetUserList',//获取工作人员列表
    GetUserInfo:'/api/services/app/FireUnitUser/GetUserInfo',//获取工作人员详情
    UpdateUserInfo:'/api/services/app/FireUnitUser/UpdateUserInfo',//修改工作人员信息
    DeleteUser:'/api/services/app/FireUnitUser/DeleteUser',//删除工作人员
    ReSetPassword:'/api/services/app/FireUnitUser/ReSetPassword',//重置密码
    ChangePassword:'/api/services/app/FireUnitUser/ChangePassword',//修改密码


    //获取趋势
    GetRecordTrend:'/api/services/app/Detector/GetRecordTrend',//
}
export default API;