<template>
    <el-dialog
        title="部件点位"
        :visible.sync="dialogVisible"
        :width="width"
        :before-close="handleClose"
        class="basemarkdialog"
    >
       
        <div v-if="detectordetail.coordinatePicture" class="fireBit" id="fireBit" ref="fireBit">

        </div>
        <div id="nodata"  class="fireBit" v-else>
        </div>
        
    </el-dialog>
</template>

<script>
import AILabel  from 'ailabel'
export default {
    props:{
        width:{
            type:String,
            default:'100%'
        },
        detectordetail:{
            type:Object,
            default(){
               return {} //某个部件的具体信息
            }
        }
    },
    data(){
        return{
            dialogVisible:false,
            gMap:{},//点位图层
            gFeatureLayer:'',
            partlocationICON:require('../assets/images/partlocation.png'),//部件定位icon
        }
    },
    methods:{
        //关闭弹出
        handleClose(){
            this.dialogVisible =false
        },
        init(){
            if(!this.detectordetail.coordinatePicture){//如果没有图片则清空所有节点
                    var el = document.getElementById('nodata'); 
                    var childs = el.childNodes; 
                    for(var i = childs .length - 1; i >= 0; i--) {
                      el.removeChild(childs[i]);
                    }
                    let p = '<p class="noData">暂无图片</p>'
                   $("#nodata").append(p)
                 return false
            }
            this.gMap = new AILabel.Map('fireBit',
                {
                    zoom: 1500, 
                    cx: 0, 
                    cy: 0, 
                    zoomMax: 650 * 10, 
                    zoomMin: 650 / 10, 
                    autoPan: true, 
                    drawZoom: true
                }
            );
            // 图片层实例\添加
            const gImageLayer = new AILabel.Layer.Image('img',  this.detectordetail.coordinatePicture, 
                {
                    w: 1480, 
                    h: 780
                }, 
                {
                    zIndex: 1
                }
            );
            this.gMap.addLayer(gImageLayer);
            // 矢量层实例\添加
            this.gFeatureLayer = new AILabel.Layer.Feature('featureLayer', 
                {
                    zIndex: 2, 
                    transparent: true
                }
            );
            this.gMap.addLayer(this.gFeatureLayer);
        },
        //标记点
        createMarker(content) {
            if(!this.detectordetail.coordinatePicture){
                return false
            }
            // console.log("content",content)
            if(content.coordinateX == 0 && content.coordinateY == 0){
                return
            }
            let  marker = new AILabel.Marker(content.detectorId, {
                src:this.partlocationICON,
                x: content.coordinateX,
                y: content.coordinateY,
                offset: {x:-10, y: -10},
            });
            this.gMap.mLayer.addMarker(marker);
            let imga =  $("#markerLayer").find('img')
            imga.on({
                mouseenter: function (e) {
                    let p =$(`<div class='partlocationinfo'>
                        <p>【网关】：${content.gatewaySn}</p>
                        <p>【部件】：${content.detectorSn}</p>
                        <p>【类型】：${content.detectorType}</p>
                        <p>【建筑】：${content.architectureName}</p>
                        <p>【楼层】：${content.floorName}</p>
                        <p>【位置】：${content.location}</p>
                    </div>`);
                    p.css({"position":"absolute"})
                    imga.after(p)
                },
                mouseleave: function (e) {
                    $('.partlocationinfo').remove()
                }
            })
        },
        
    }
}
</script>

<style lang="less">
    .basemarkdialog{
        .el-dialog{
        color: white;
        border: 1px solid #007ED8;
        border-radius: 8px;
        height: 100%;
        margin: 0 !important;
        .el-dialog__header{
            height: 8%;
            box-sizing: border-box;
            background: #020D1C;
            border-bottom: 1px solid #007ED8;
            text-align: center;
            font-family:'Times New Roman', Times, serif;
            font-weight: bold;
            .el-dialog__title{
                color: white;
                text-align: center;
            }
            .el-dialog__close{
                font-size: 20px;
                font-weight: bold;
                color: white;
                &:hover{
                  
                    color: #E45262;
                }
            }
        }
        .el-dialog__body{
            background:#020D1C;
            height: 92%;
            box-sizing: border-box;
           
            .fireBit{
                width: 100%;
                height: 100%;
                position: relative;
                .noData{
                    color: white;
                    font-size: 20px;
                    text-align: center;
                }
                #markerLayer{
                    position: relative;
                    img{
                        width: 20px;
                        height: 20px;
                    }
                    .partlocationinfo{
                        p{
                            line-height: 1.5;
                        }
                        background: #007ED8;
                        padding: 10px;
                        border-radius: 6px;
                        color: white;

                    } 
                }
            }
            
            

            }
        }
        
    }
</style>