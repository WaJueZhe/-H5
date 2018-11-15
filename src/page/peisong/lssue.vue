<template>
  <div class="lssue">
      <!-- 头部 -->
     <!-- <app-comhed :name="headerName"></app-comhed> -->
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
              
                <tr v-for="(item,index) of taskInf.detailList" :key="index" >
                  <td><span v-if="item.unloadCompany">{{item.unloadCompany}}/</span>{{item.unloadContactPerson}}</td>
                  <td>{{item.unitDesc}}</td>
                  <td>{{item.plannedUnits}}{{taskInf.unitUnit}}{{item.plannedVolume}}{{taskInf.volumeUnit}}{{item.plannedWeight}}{{taskInf.weightUnit}}</td>
                  <td v-if="item.sendActUnits==item.plannedUnits" v-on:click ="modify(item.shpId)">{{item.sendActUnits}}{{taskInf.unitUnit}}<img src="../../assets/img/icn_modify.png"></td>
                  <td v-if="item.sendActUnits!=item.plannedUnits" style="color:red;font-weight:bold" v-on:click ="modify(item.shpId)">{{item.sendActUnits}}{{taskInf.unitUnit}}<img src="../../assets/img/icn_modify.png"></td>
                </tr>
          </table>
      </div>
      <!-- 表单提交 -->
      <div class="form">
          <div>
              <span>发货人姓名：</span>
              <input type="text" v-model="username" placeholder="请输入发货人姓名">
          </div>
          <div>
              <span>联系人电话：</span>
              <input type="text" v-show="!showNewPhone" v-model="phone" readonly class="phone">
              <input type="text" v-show="showNewPhone" v-model="newphone" placeholder="请输入联系人电话" class="phone">
              <button class="button2" v-show="!showNewPhone" @click="changePhone">修改</button>
          </div>
          <div v-show="showCode">
            <span>身份证号码：</span>
            <input type="text" v-model="usercode" placeholder="请输入你的身份证号码">
          </div>         
          <div>
              <span>验证码：</span>
              <input type="text" v-model="code" placeholder="输入验证码">
              <button @click="verification">获取验证码</button>
          </div>
      </div>
      <!-- 签名版 -->
      <app-canvas :evaluateName="username" :vehicleNo="taskInf.vehicleNo" :driverName="taskInf.driverName" :driverId="taskInf.driverId" :longitudeX="longitudeX" :latitudeY="latitudeY" :qianfa="true" :zdid="taskInf.stopId" :username="username" :planname="planname" :usercode="usercode" :code="code" :phone="usertel" :wxid="userwxid"></app-canvas>
  </div>
</template>

<script>
import canvas from "../../components/peisong/canvas.vue";
import ModifyBox from "../../components/peisong/modifyBox.vue";
import wx from "weixin-js-sdk";
import { wx_init } from "../../js/weixin.js";
import { GetDistance } from "../../js/mapUtil.js";
import { InfiniteScroll } from "mint-ui";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import Vue from "vue";

// import BMap from "BMap"; //引用baiduMap相关的API
Vue.use(InfiniteScroll);

export default {
  watch: {
    username() {
      if (this.fusername != this.username) {
        this.usercode = "";
        this.showCode = true;
      }
    }
  },
  data() {
    return {
      wxjs_environment:'',
      showNewPhone: false,
      newphone: "",
      phone: "",
      stopId: "",
      planname: "",
      fusername: "",
      username: "",
      usercode: "",
      showCode: false,
      usertel: "",
      userwxid: "",
      code: "",
      headerName: "签发",
      operation: "返回",
      longitudeX: "",
      latitudeY: "",
      driverinf: "",
      unitList: [],
      taskInf: "",
      indexNo: ""
    };
  },
  components: {
    "app-canvas": canvas,
    "app-modify": ModifyBox
  },
  methods: {
    changePhone() {
      this.showNewPhone = true;
    },
    sendCode() {
      Indicator.open();
      let param = {"phone": this.usertel, "name": this.username, "icode": this.usercode};
      this.axios
        .post(`${this.api.baseURL}/taskStop/sign/signSendsmsh5`, param)
        .then(res => {
          //   console.log(res);
          Indicator.close();
          if (res.data.success) {
            Toast("验证码已发至发货联系人");
          }
        });
    },
    //获取验证码事件
    verification() {
      if (this.showNewPhone) {
        let reg=11&& /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;//手机号正则验证
        if (this.newphone == "" || this.newphone == null) {
          Toast("请输入手机号码");
          return;
        } else if (!reg.test(this.newphone)) {
          Toast("手机号码格式不对");
          return;
        }else{
          this.usertel=this.newphone;
        }
      }
      if (this.usercode == "" || this.usercode == null) {
        Toast("请输入身份证号码");
        return;
      }
      if (this.username == "" || this.username == null) {
        Toast("请输入发货人");
        return;
      }
      this.sendCode();
    },
    // 修改货物信息
    modify(val) {
      this.$router.push({ name: 'cargoAffirmSend', params:{shpId: val,stopId:this.stopId}})
    },
    //请求获取货物信息
    init() {
      Indicator.open();
      let p = {
        stopId:this.stopId
      };
      this.axios
        .post(`${this.api.baseURL}/taskStop/stopExceptionInfo`,p)
        .then(res => {
          console.log(res);
          Indicator.close();
          if (res.data.success) {
            this.taskInf = res.data.data.ret;
            this.unitList = this.taskInf.detailList;

            if(this.phone==''||this.phone==null){
              this.phone = this.handlePhone(this.taskInf.contactMobile);
            }
            this.planname = this.taskInf.contactPerson;
            if (
              this.username == null ||
              this.username == "" ||
              this.username == "null" ||
              this.username == "undefined"
            ) {
              this.username = this.taskInf.contactPerson;
              this.fusername = this.username;
            }
            if(this.usertel==null||this.usertel==''){
              this.usertel = this.taskInf.contactMobile;
            }           
            if (this.taskInf.signTime != null && this.taskInf.signTime != "") {
              MessageBox.alert("该站点已完成签发，不能重复签发").then(
                action => {
                  
                  
                  if(window.__wxjs_environment === 'miniprogram'){   //判断是否在微信小程序内执行
                    wx.miniProgram.navigateBack({
                      delta: 1
                    })
                    return
                  }

                  var ua = navigator.userAgent.toLowerCase();
                  if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    WeixinJSBridge.invoke("closeWindow", {}, function(res) {});
                  } else if (ua.indexOf("alipay") != -1) {
                    AlipayJSBridge.call("closeWebview");
                  } else if (ua.indexOf("baidu") != -1) {
                    BLightApp.closeWindow();
                  } else {
                    window.close();
                  }
                }
              );
            }
          }
        });
    },
    translateCallback(data) {
      this.longitudeX = data.points[0].lng;
      this.latitudeY = data.points[0].lat;
    },
    //处理隐藏手机号码信息
    handlePhone(value) {
      let arr = [...value];
      let preArr = arr.slice(0, 3);
      let afterArr = arr.slice(-3);
      let midArr = arr.slice(4, arr.length - 2);
      midArr = midArr.map(function() {
        return "*";
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join("");
    }
  },
  beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready(function() {
      //获取用户信息
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
    // 配置微信
    let url = location.href.split("#")[0];
    this.stopId = this.$route.query.stopId;
    this.usercode = this.$route.query.scdid;
    if (this.usercode == null ||this.usercode == "" ||this.usercode == "null") {
      this.showCode = true;
    } else {
      this.username = decodeURI(location.href.substr(1).split("sname=")[1]);
      this.fusername = this.username;
    }
    this.usertel = this.$route.query.tel;

    if(this.usertel!=''&&this.usertel!=null){
      this.phone=this.handlePhone(this.usertel);
    }
    this.userwxid = this.$route.query.openid;
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

  // 表单提交
  .form {
    margin-top: px2rem(20px);
    width: 100%;
    color: zCl;
    background-color: #ffffff;

    div {
      position: relative;
      font-size: px2rem(30px);
      color: zCl;

      input {
        width: 100%;
        height: px2rem(80px);
        box-sizing: border-box;
        border-top: 1px solid #d9d9d9;
        font-size: px2rem(30px);
        padding-left: px2rem(220px);
      }

      .phone {
        color: #999;
      }

      span {
        position: absolute;
        top: 50%;
        left: px2rem(20px);
        transform: translateY(-50%);
        width:px2rem(200px);
        height: px2rem(80px);
        line-height: px2rem(80px);
      }

      button {
        position: absolute;
        right: px2rem(20px);
        top: px2rem(9px);
        width: px2rem(202px);
        height: px2rem(80px);
        line-height: px2rem(80px);
        font-size: px2rem(28px);
        background-color: bg-col;
        text-align: center;
        color: #ffffff;
        border-radius: px2rem(20px);
      }

      .button2 {
        position: absolute;
        right: px2rem(20px);
        top: px2rem(7px);
        width: px2rem(202px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        font-size: px2rem(28px);
        background-color: bg-col;
        text-align: center;
        color: #ffffff;
        border-radius: px2rem(20px);
      }
    }

    div:last-child {
      border-bottom: 1px solid #d9d9d9;

      input {
        height: px2rem(96px);
        padding-left: px2rem(220px);
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


