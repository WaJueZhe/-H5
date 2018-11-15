<template>
  <div class="lssue">
      <!-- 头部 -->
     <app-comhed :name="headerName" :back="true" :operation = "operation"></app-comhed>
      <!-- 用户信息 -->
      <div class="user">
          <div class="img">
              <img v-if="stopInf.driverPic" v-bind:src="api.resourceurl+stopInf.driverPic">
              <img v-if="!stopInf.driverPic" src="static/user.jpg">
          </div>
          <div class="usname">
              <ul>
                <li>车牌号：{{stopInf.vehicleNo}}</li>
                <li>司机：{{stopInf.driverName}}</li>
                <li>手机：{{stopInf.driverMobile}}</li>
              </ul>
          </div>
      </div>
      <!-- 货物信息 -->
      <div class="information">
        <div class="information-title">
          <table>
            <tr>
              <td>发货人</td>
              <td>货物类型</td>
              <td>发货件数</td>
              <td>实际签收</td>
            </tr>
          </table>
        </div>
        <div class="information-box" v-for="(item,index) in stopInf.detailList" :key="index">
          <table style="word-break:break-all;" @click="information(item,index)" :class="{ informationActive : informationIndex == index }">
            <tr class="tab">
              <td>
                <span v-if="item.deliverCompany">{{item.deliverCompany}}</span>
                <span v-if="!item.deliverCompany">{{item.deliverContactPerson}}</span>
                </td>
              <td>{{item.unitDesc}}</td>
              <td>{{item.sendActUnits}}件</td>
              <td>{{item.recvActUnits}}件
                <i v-if="!(item.confExp>0||item.confNumExp>0||item.unConfExp>0||item.unConfNumExp>0)" class="iconfont icon-success"></i>
                <span v-if="item.confExp>0||item.confNumExp>0||item.unConfExp>0||item.unConfNumExp>0" class="wrong"><img src="../../assets/img/u841.png" alt=""></span>                
              </td>
            </tr>
          </table>

          <div class="info-box" v-show="index+1==showBoxIndex&&showBoxIndex!=null">
            <div class="info-item">
              <div class="sign-status" @click="groupBox = !groupBox">
                签收情况：<span>{{item.totalAct}}</span>件 
                <i class="iconfont icon-jiantou_xia" v-show="groupBox == true"></i>
                <i class="iconfont icon-jiantou" v-show="groupBox == false"></i>
              </div>
              <div class="group-box" v-show="groupBox">
                <div class="group">
                  <table>
                    <tr>
                      <td>货物类型</td>
                      <td>发货数量</td>
                      <td>实际签收</td>
                    </tr>
                  </table>
                </div>
                <div class="message-box">
                  <table style="word-break:break-all;">
                    <tr class="tab" v-for="(act,actIndex) in item.actUnitDetailList" :key="actIndex">
                      <td>{{act.unitDesc}}</td>
                      <td>{{act.sendActUnits}}件</td>
                      <td v-if="act.sendActUnits!=act.recvActUnits" style="color:red">{{act.recvActUnits}}件</td>
                      <td v-if="act.sendActUnits==act.recvActUnits">{{act.recvActUnits}}件</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="info-item">
              <div class="sign-status" @click="abnormalBox = !abnormalBox">
                异常情况：货损<span>{{item.totalHS}}</span>件，货差<span>{{item.totalHC}}</span>其他<span>{{item.totalQT}}</span>件，
                <i class="iconfont icon-jiantou_xia" v-show="abnormalBox == true"></i>
                <i class="iconfont icon-jiantou" v-show="abnormalBox == false"></i>
              </div>
              <div class="group-box" v-show="abnormalBox&&item.detailList.length>0">
                <div class="group">
                  <table>
                    <tr>
                      <td>货物名称/编码</td>
                      <td>数量</td>
                      <td>异常情况</td>
                    </tr>
                  </table>
                </div>
                <div class="message-box">
                  <table style="word-break:break-all;">
                    <tr class="tab" v-for="(exp,expIndex) in item.detailList" :key="expIndex">
                      <td>{{exp.itemName}}/{{exp.itemCode}}</td>
                      <td>{{exp.quantity}}</td>
                      <td>{{exp.exceptionType|expType}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="big-box">
        <div class="infoDetail">
          <div class="take">收货人：<span v-if="stopInf.stopCompany">{{stopInf.stopCompany}}/</span>{{stopInf.contactPerson}} <span class="phone">{{stopInf.contactMobile}}</span></div>
        </div>
      <!-- 签名版 -->
      <app-canvas :exception="true" class="canvas" :taskId="taskId" :zdid="stopId" :longitudeX="longitudeX" :latitudeY="latitudeY"></app-canvas>
      </div>
  </div> 
</template>

<script>
import canvas from "../../components/peisong/canvas.vue";
import ModifyBox from "../../components/peisong/modifyBox.vue";

import { wx_init } from "../../js/weixin.js";
import { GetDistance } from "../../js/mapUtil.js";
import { InfiniteScroll } from "mint-ui";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import Vue from "vue";
import wx from "weixin-js-sdk";
import BMap from "BMap"; //引用baiduMap相关的API
import { MessageBox } from "mint-ui";
Vue.use(InfiniteScroll);

export default {
  data() {
    return {
      showNewPhone: false,
      stopId: "",
      taskId:"",
      headerName: "异常签收确认",
      operation: "返回",
      longitudeX: "",
      latitudeY: "",
      stopInf: "",
      index: "",
      address: "未知位置",
      groupBox:false,
      abnormalBox:false,
      infoBox:false,
      informationIndex:0,
      showBoxIndex:null
    };
  },
  filters: {
    expType(val){
      switch(val){
        case 1:
        return '货损';
        break;
        case 2:
        return '货差';
        break;
        default:
        return '其他'
        break;
      }
    }
  },
  components: {
    "app-canvas": canvas,
    "app-modify": ModifyBox
  },
  methods: {
    //点击背景颜色切换
    information(item,index){
      // if(item.confExp>0||item.confNumExp>0||item.unConfExp>0||item.unConfNumExp>0){
        this.informationIndex = index;
        if(this.showBoxIndex!=''&&this.showBoxIndex!=null){
          this.showBoxIndex = null;
        }else{
          this.showBoxIndex = index+1
        }
      // }
    },
    loadData(){
      Indicator.open();
      let p = {
        stopId:this.stopId
      }
      this.axios
        .post(`${this.api.baseURL}/taskStop/stopExceptionInfo`,p)
        .then(res => {
          console.log(res)
          Indicator.close();
          if (res.data.success) {
            this.stopInf = res.data.data.ret;
            if(this.stopInf.detailList.length>0){
              let haveUnconf = false;
              for(let i=0;i<this.stopInf.detailList.length;i++){
                let totalAct = 0;
                let actList = this.stopInf.detailList[i].actUnitDetailList;
                for(let j=0;j<actList.length;j++){
                  totalAct = Number(totalAct)+Number(actList[j].recvActUnits);
                }
                this.stopInf.detailList[i].totalAct = totalAct;

                let totalHS = 0;
                let totalHC = 0;
                let totalQT = 0;
                let expList = this.stopInf.detailList[i].detailList;
                for(let j=0;j<expList.length;j++){
                  if(expList[j].exceptionType==1){
                    totalHS = Number(totalHS)+Number(expList[j].quantity);
                  }else if(expList[j].exceptionType==2){
                    totalHC = Number(totalHC)+Number(expList[j].quantity);
                  }else{
                    totalQT = Number(totalQT)+Number(expList[j].quantity);
                  }                
                }
                this.stopInf.detailList[i].totalHS = totalHS;           
                this.stopInf.detailList[i].totalHC = totalHC;   
                this.stopInf.detailList[i].totalQT = totalQT;  
                
                //判断如果没有异常数据直接返回
                let item = this.stopInf.detailList[i];
                if(item.confExp>0||item.confNumExp>0||item.unConfExp>0||item.unConfNumExp>0){
                  haveUnconf = true;
                }
                if(!haveUnconf){
                  MessageBox.confirm("无待确认数据", "提示", false).then(action => {
                    this.$router.push({
                      name:"task1Detail",
                      params:{taskid: _this.taskId}
                    });
                  });                
                }
              }
            }else{
              MessageBox.confirm("无待确认数据", "提示", false).then(action => {
                this.$router.push({
                  name:"task1Detail",
                  params:{taskid: _this.taskId}
                });
              });
            }
          }
        });
    }
  },
  created() {
    // 配置微信
    let url = location.href.split("#")[0];
    this.stopId = this.$route.params.stopId;
    this.taskId = this.$route.params.taskId;
    this.loadData();
    // let url = this.$route.path;
    wx_init(url);
  },
  beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready(function() {
      //获取用户经纬度信息
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          _this.longitudeX = res.longitude;
          _this.latitudeY = res.latitude;
        }
      });
    });
  },
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

bg-col = #061128;
zCl = #383838;

.lssue {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #ececec;
    margin-top: px2rem(80px);

    // 头部
    .header {
        width: 100%;
        height: px2rem(80px);
        background-color: bg-col;
    }

    // 用户信息
    .user {
        position: relative;
        width: 100%;
        background-color: #ffffff;
        height: px2rem(168px);
        overflow: hidden;
        color: zCl;

        // 头像
        .img {
            position: absolute;
            top: 50%;
            left: px2rem(40px);
            transform: translateY(-50%);
            width: px2rem(140px);
            height: px2rem(140px);
            border-radius: 50%;
            background-color: skyblue;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .usname {
            position: absolute;
            top: 50%;
            left: px2rem(200px);
            transform: translateY(-50%);
            font-size: px2rem(30px);
        }
    }

    // 货物信息
    .information {
      width: 100%;
      font-size: px2rem(24px);
      background-color: #ffffff;

      .information-title {
        table {
          width: 100%;
          text-align: center;
          border-bottom: 1px solid #d9d9d9;

          tr {
            height:5vh;
            background-color: bg-col;
            color: #ffffff;

            td {
              width:25%;
              box-sizing: border-box;
              border-right: 1px solid #dedede;
            }
          }
        }
      }

      .information-box {
        table {
          width: 100%;
          text-align: center;
          border-bottom: 1px solid #d9d9d9;

          > tr {
            height:5vh;

            > td {
              width:25%;
              box-sizing: border-box;
              border-right: 1px solid #dedede;

              > i {
                margin-left:px2rem(10px);
                color: #007aff;
                font-weight:bold;
              }

              .wrong {
                > img {
                  width:px2rem(40px);
                  height:px2rem(40px);
                }
              }
            }
          }
        }

        .informationActive {
          // background-color:#71d6ff;
          background-color:#ccffff;
        }

        .info-box {
          .info-item {
            width:100%;

            .sign-status {
              padding: 0 px2rem(16px);
              width:100%;
              height:px2rem(80px);
              line-height:px2rem(80px);
              font-size:px2rem(28px);
              background-color: #dadada;
              border-bottom:1px solid #ccc;            

              > span {
                color:blue;
              }

              > i {
                float:right;
                // transform:rotate(-90deg);
              }
            }

            .group-box {
              .group {
                width:100%;
                display:flex;
                justify-content:space-between;
                box-sizing:border-box;
                background-color: #f5f5f5;

                table {
                  width: 100%;
                  text-align: center;
                  border-bottom: 1px solid #d9d9d9;

                  > tr {
                    height:5vh;

                    > td {
                      padding:px2rem(20px);
                      width:33.3333%;
                      font-size:px2rem(28px);
                      box-sizing: border-box;
                      border-right: 1px solid #dedede;

                      > i {
                        margin-left:px2rem(10px);
                        color: #007aff;
                        font-weight:bold;
                      }

                      .wrong {
                        > i {
                          margin-left:px2rem(10px);
                          color:red;
                          font-weight:bold;
                        }
                      }
                    }
                  }
                }
              }

              .message-box {
                table {
                  width: 100%;
                  text-align: center;
                  border-bottom: 1px solid #d9d9d9;

                  > tr {
                    height:5vh;

                    > td {
                      padding:px2rem(20px);
                      width:33.3333%;
                      font-size:px2rem(28px);
                      box-sizing: border-box;
                      border-right: 1px solid #dedede;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

  .infoDetail {
    margin-top:px2rem(20px);

    .take {
      padding-left:px2rem(30px);
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(28px);
      background-color: #fff;
      border-bottom:1px solid #ccc;

      .money {
        color:blue;
      }

      .phone {
        padding-left:px2rem(40px);
        .number {
          color:blue;
        }
      }
    }
  }
}

// 货物信息弹框动画
// 控制弹框操作
.modify-enter-active {
    transition: all 0.5s;
}

.modify-leave-active {
    transition: all 0.5s;
}

.modify-enter {
    opacity: 0;
}

.modify-leave-to {
    opacity: 0;
}
</style>


