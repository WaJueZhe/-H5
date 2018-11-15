<template>
  <div class="lssue">
    <!-- 头部 -->
    <app-comhed :name="headerName"></app-comhed>
    <!-- 用户信息 -->
    <div class="user">
      <div class="img">
        <img v-if="taskInf.driverPic" v-bind:src="api.resourceurl+taskInf.driverPic">
        <img v-if="!taskInf.driverPic" src="static/user.jpg">
      </div>
      <div class="usname">
        <ul>
          <li>车牌号：{{taskInf.vehicleNo}}</li>
          <li>司机：{{taskInf.driverName}}</li>
          <li>手机：{{taskInf.driverMobile}}</li>
        </ul>
      </div>
    </div>
    <!-- 货物信息 -->
    <div class="information">
      <table>
        <tr>
          <td>收货人</td>
          <td>货物类型</td>
          <td>计划发货</td>
          <td>实际发货</td>
        </tr>

        <tr v-for="(item,indexNo) in taskInf.detailList" :key="indexNo">
          <td><span v-if="item.unloadCompany">{{item.unloadCompany}}/</span>{{item.unloadContactPerson}}</td>
          <td>{{item.unitDesc}}</td>
          <td>{{item.plannedUnits}}{{taskInf.unitUnit}}{{item.plannedVolume}}{{taskInf.volumeUnit}}{{item.plannedWeight}}{{taskInf.weightUnit}}</td>
          <td v-if="item.sendActUnits==item.plannedUnits">{{item.sendActUnits}}{{taskInf.unitUnit}}</td>
          <td v-if="item.sendActUnits!=item.plannedUnits" style="color:red;font-weight:bold" >{{item.sendActUnits}}{{taskInf.unitUnit}}</td>
        </tr>

      </table>
    </div>
    <!-- 发货人 -->
    <div class="form">
        <span>发货人姓名：{{ taskInf.contactPerson }}</span><br>
    </div>
    <div class="form">
        <span>发货人电话：{{ taskInf.contactMobile|handlePhone }}</span>
    </div>

    <div class="fff"></div>
    <!-- 签名版 -->
    <app-canvas :fahuo="true" class="canvas" :zdid="taskInf.stopId" :taskId="taskInf.taskId" :longitudeX="longitudeX" :latitudeY="latitudeY"></app-canvas>
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
// import BMap from "BMap"; //引用baiduMap相关的API
Vue.use(InfiniteScroll);

export default {
  data() {
    return {
      stopId: "",
      username: "",
      headerName: "起运",
      operation: "返回",
      longitudeX: "",
      latitudeY: "",
      taskInf: ""
    };
  },
  components: {
    "app-canvas": canvas
  },
  filters: {
    handlePhone(val) {
      val = String(val);
      let after = val.slice(8);
      let before = val.slice(0,3);
      return before+"*****"+after;
    }
  },
  methods: {
    init() {
      Indicator.open();
      let p = {
        stopId:this.stopId
      };
      this.axios
        .post(`${this.api.baseURL}/taskStop/stopExceptionInfo`,p)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            this.taskInf = res.data.data.ret;
          }
        });
    },
    translateCallback(data) {
      this.longitudeX = data.points[0].lng;
      this.latitudeY = data.points[0].lat;
    }
    
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
  created() {
    this.stopId = this.$route.query.stopId;
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
    this.init();
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

bg-col = #061128;
zCl = #383838;

.lssue {
    margin-top: px2rem(80px);
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #ececec;

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

    .information {
        width: 100%;
        font-size: px2rem(24px);
        background-color: #ffffff;

        table {
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #d9d9d9;
        }

        tr {
            height:5vh;
            &:first-child {
              line-height:px2rem(60px);
            } 

            td {
                box-sizing: border-box;
                border-right: 1px solid #dedede;
            }

            td:first-child {
                width: px2rem(166px);
            }

            td:nth-child(2) {
                width: px2rem(166px);
            }

            td:nth-child(3) {
                width: px2rem(210px);
            }

            td:last-child {
                width: px2rem(212px);

                img {
                    margin-bottom: px2rem(8px);
                    margin-left: px2rem(6px);
                }
            }
        }

        tr:first-child {
            background-color: bg-col;
            color: #ffffff;

            td {
                border-right: 1px solid #ffffff;
            }
        }

        tr:nth-child(2) {
            border-bottom: 1px solid #dedede;
        }
    }

    .form {
        height: px2rem(80px);
        line-height: px2rem(80px);
        background-color: #ffffff;
        font-size: px2rem(30px);
        margin-top: px2rem(20px);
        padding-left: px2rem(20px);
    }
    .fff{
        width 100%
        height px2rem(600px)
        background-color #ececec
    }
    .canvas {
        position: fixed;
        bottom: 0;
        left: 0;
    }
}
</style>


