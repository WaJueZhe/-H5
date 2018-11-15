<template>
  <div class="lssue">
      <!-- 头部 -->
     <!-- <app-comhed :name="headerName" :operation = "operation"></app-comhed> -->
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
          <table>
              <tr>
                  <td>发货人</td>
                  <td>货物描述</td>
                  <td>发货数量</td>
                  <td>收货数量</td>
              </tr>
                 <tr v-for="(item,index) of stopInf.detailList" :key="index" >
                  <td><span v-if="item.deliverCompany">{{item.deliverCompany}}/</span>{{item.deliverContactPerson}}</td>
                  <td>{{item.unitDesc}}</td>
                  <td>{{item.sendActUnits}}{{stopInf.unitUnit}}{{item.sendActVolume}}{{stopInf.volumeUnit}}{{item.sendActWeight}}{{stopInf.weightUnit}}</td>
                  <td v-if="item.sendActUnits==item.recvActUnits" v-on:click ="modify(item.shpId)">
                    {{item.recvActUnits}}{{stopInf.unitUnit}}<img src="../../assets/img/icn_modify.png">
                    <span v-if="item.unConfExp>0||item.unConfNumExp>0" style="color:red;font-weight:bold"><br>(待司机确认异常)</span>
                    <span v-if="(item.unConfNumExp==null||item.unConfNumExp==0)&&(item.unConfExp==null||item.unConfExp==0)&&(item.confExp>0||item.confNumExp>0)" style="color:green;font-weight:bold"><br>(司机已确认异常)</span>
                    </td>
                  <td v-if="item.sendActUnits!=item.recvActUnits" style="color:red;font-weight:bold" v-on:click ="modify(item.shpId)">
                    {{item.recvActUnits}}{{stopInf.unitUnit}}<img src="../../assets/img/icn_modify.png">
                    <span v-if="item.unConfExp>0||item.unConfNumExp>0" style="color:red;font-weight:bold"><br>(待司机确认异常)</span>
                    <span v-if="(item.unConfNumExp==null||item.unConfNumExp==0)&&(item.unConfExp==null||item.unConfExp==0)&&(item.confExp>0||item.confNumExp>0)" style="color:green;font-weight:bold"><br>(司机已确认异常)</span>
                    </td>
                </tr>
          </table>
      </div>
      <!-- 表单提交 -->
      <div class="form">
          <div>
              <span>收货人姓名：</span>
              <input type="text" v-model="username" placeholder="请输入发货人姓名">
          </div>
          <div>
              <span>联系电话：</span>
              <!-- <input type="text" v-model="phone" readonly placeholder="请输入联系电话" class="phone"> -->
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
      <app-canvas :evaluateName="username" :address="address" :vehicleNo="stopInf.vehicleNo" :driverName="stopInf.driverName" :driverId="stopInf.driverId" :longitudeX="longitudeX" :latitudeY="latitudeY" :qianshou="true" :zdid="stopInf.stopId" :username="username" :planname="planname" :usercode="usercode" :code="code" :phone="usertel" :wxid="userwxid"></app-canvas>
      
      
  </div> 
</template>

<script>
import canvas from "../../components/peisong/canvas.vue";
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
      showNewPhone: false,
      newphone: "",
      phone: "",
      indexNo: "",
      stopId: "",
      planname: "",
      fusername: "",
      username: "",
      usercode: "",
      showCode: false,
      usertel: "",
      userwxid: "",
      code: "",
      headerName: "签收",
      operation: "返回",
      longitudeX: "",
      latitudeY: "",
      driverinf: "",
      unitList: [],
      stopInf: "",
      index: "",
      address: "未知位置",
      isSub:false
    };
  },
  components: {
    "app-canvas": canvas,
  },
  methods: {
    changePhone() {
      this.showNewPhone = true;
    },
    sendCode() {
      Indicator.open();
      let param = {"phone": this.usertel, "name": this.username, "icode": this.usercode};
      this.axios
        .post(`${this.api.baseURL}/taskStop/sign/signArrivedsmsh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("验证码已发至收货联系人");
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

      //判断司机是否已经确认过签名
      Indicator.open();
      let p = {
        stopId:this.stopId
      }
      this.axios.post(`${this.api.baseURL}/bsShipmentException/judgeShipmentsConfir`,p).then(res => {
        Indicator.close();
        if(!res.data.success){
          MessageBox('提示', '司机尚未确认异常');
        }else{
          this.sendCode();
        }
      }); 
    },
    createNotice(stopId) {
      let _this = this;
      this.stompClient.stompClient.subscribe(
        "/topic/bsnotice/receiver" + stopId,
        function(messageOutput) {     
          var obj = JSON.parse(messageOutput.body);
          // console.log(obj);
          if (obj.text == "SE") {
              MessageBox("提示", "司机已确认异常数据!");
              _this.init();
          }                 
        }
      );
    },    
    // 修改货物信息
    modify(val) {
      this.$router.push({ name: 'cargoAffirm', params:{shpId: val,stopId:this.stopInf.stopId ,address:this.address}})
    },
    init() {
      // console.log("更新了");
      Indicator.open();
      let p = {
        stopId:this.stopId
      };
      this.axios
        .post(`${this.api.baseURL}/taskStop/stopExceptionInfo`,p)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.stopInf = res.data.data.ret;
            this.unitList = this.stopInf.detailList;

            if(this.phone==''||this.phone==null){
              this.phone = this.handlePhone(this.stopInf.contactMobile);
            }
            this.planname = this.stopInf.contactPerson;
            if (
              this.username == null ||
              this.username == "" ||
              this.username == "null" ||
              this.username == "undefined"
            ) {
              this.username = this.stopInf.contactPerson;
              this.fusername = this.username;
            }
            if(this.usertel==null||this.usertel==''){
              this.usertel = this.stopInf.contactMobile;
            }  

            if (this.stopInf.signTime != null && this.stopInf.signTime != "") {
              MessageBox.alert("该站点已完成签收，不能重复签收").then(
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
            if(!this.isSub){
              setTimeout(() => {
                this.createNotice(this.stopId);
                this.isSub = true;
              }, 3000);
            }
          }
        });
    },
    translateCallback(data) {
      this.longitudeX = data.points[0].lng;
      this.latitudeY = data.points[0].lat;
      let _this = this;
      var myGeo = new BMap.Geocoder();
      myGeo.getLocation(
        new BMap.Point(this.longitudeX, this.latitudeY),
        function(result) {
          if (result) {
            _this.address = result.address;
          }
        }
      );
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
  created() {
    // 配置微信
    let url = location.href.split("#")[0];
    this.stopId = this.$route.query.stopId;
    this.usercode = this.$route.query.scdid;
    if (
      this.usercode == null ||
      this.usercode == "" ||
      this.usercode == "null"
    ) {
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
    // let url = this.$route.path;
    wx_init(url);

    
    this.init();
  },
  beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready(function() {
      //获取用户信息
      wx.getLocation({
        type: "wgs84",
        success: function(res) {
          var ggPoint = new BMap.Point(res.longitude, res.latitude);
          var convertor = new BMap.Convertor();
          var pointArr = [];
          pointArr.push(ggPoint);
          convertor.translate(pointArr, 1, 5, _this.translateCallback);
        }
      });
    });

    this.stompClient.stompClient.connect({}, function(frame) {
      // console.log(frame);
    });
  }
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

            .phone {
                color: #999;
            }

            input {
                width: 100%;
                height: px2rem(80px);
                box-sizing: border-box;
                border-top: 1px solid #d9d9d9;
                font-size: px2rem(30px);
                padding-left: px2rem(220px);
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
</style>


