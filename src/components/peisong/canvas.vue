<template>
  <div class="canvas" @touchstart="blur" >
		<vueSignature ref="signature" :sigOption="option" :w="'100%'" :h="'100%'" ></vueSignature> 
        <span v-show="isshow">手写签名</span>
        <div class="but" v-if="qianshou">
            <button @click="clear">清除签名</button>
            <button @click="save">确认签名</button>
            <!-- <div class="int" @click="imgupload"><span>拍照留证</span></div> -->
        </div>
         <div class="but" v-if="exception">
            <button @click="clear">清除签名</button>
            <button @click="expSign">确认签名</button>
            <!-- <div class="int" @click="imgupload"><span>拍照留证</span></div> -->
        </div>       
        <div class="but1" v-show="qianfa">
            <button @click="clear">清除签名</button>
            <button @click="save">确认签发</button>
        </div>
        <div class="bnt" v-if="fahuo">
          <button @click="clear">清除签名</button>
          <button @click="stopBing">确认起运</button>
        </div>
        <transition name="fade">
          <app-drop v-show="$store.state.dropBox"></app-drop>
        </transition>
        <div class="zezhao" v-show="$store.state.dropBox"></div>       
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import DropCompontent from "../../components/peisong/dropdown.vue";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import { InfiniteScroll } from "mint-ui";
import wx from "weixin-js-sdk";
import { wx_init } from "../../js/weixin.js";
import VueImgInputer from "vue-img-inputer";

export default {
  props: [
    "address",
    "exception",
    "qianshou",
    "fahuo",
    "qianfa",
    "zdid",
    "planname",
    "username",
    "usercode",
    "wxid",
    "code",
    "phone",
    "longitudeX",
    "latitudeY",
    "signType",
    "driverId",
    "driverName",
    "vehicleNo",
    "evaluateName",
    "taskId"
  ],
  data() {
    return {
      option: {
        penColor: "#000"
      },
      list: [],
      mlist: [],
      isshow: true, //控制手写签名的显示
      isSendSign: true,
      picValue: ""
    };
  },
  methods: {
    imgupload() {
      let _this = this;
      this.$router.push({
        name: "ImgUploadPage",
        params: {
          stopId: _this.zdid,
          adr: _this.address
        }
      });
    },
    blur() {
      let arr = document.querySelectorAll("input");
      for (var i = 0; i < arr.length; i++) {
        arr[i].blur();
      }
      this.isshow = false;
    },
    expSign(){
      var _this= this;
      var isEmpty = _this.$refs.signature.isEmpty();
      Indicator.open();
      let param = {
        "stopId": this.zdid,
        "longitudeX": this.longitudeX,
        "latitudeY": this.latitudeY
        };

      if (!isEmpty) {
        var png = _this.$refs.signature.save();
        param.imgData = png

      }

      this.axios.post(`${this.api.baseURL}/bsShipmentException/driverSign`, param).then(res => {
        Indicator.close();
        if (res.data.success) {
          Toast("成功确认!");
          this.$router.push({
            name:"task1Detail",
            params:{taskid: _this.taskId}
          });
        } else {
          MessageBox.confirm(res.data.message, "提示", false).then(action => {
            this.$router.push({
              name:"task1Detail",
              params:{taskid: _this.taskId}
            });
          });
        }
      });      
    },
    stopBing() {
      var _this = this;
      var isEmpty = _this.$refs.signature.isEmpty();
      Indicator.open();
      let param = {
        "stopId": this.zdid,
        "longitudeX": this.longitudeX,
        "latitudeY": this.latitudeY
        };

      if (!isEmpty) {
        var png = _this.$refs.signature.save();
        param.imgData = png

      }

      this.axios.post(`${this.api.stopBegin}`, param).then(res => {
        Indicator.close();
        if (res.data.success) {
          Toast("站点发运成功!");
          this.$router.push({
            name:"task1Detail",
            params:{taskid: _this.taskId}
          });
        } else {
          Toast(res.data.message);
        }
      });
    },
    reloadList() {
      this.list = this.ulist;
      this.mlist = this.mulist;
    },
    clear() {
      var _this = this;
      _this.$refs.signature.clear();
      this.isshow = true;
    },
    save() {
      var _this = this;
      var isEmpty = _this.$refs.signature.isEmpty();
      if (isEmpty) {
        Toast({
          message: "您还未签名，请签名"
        });
        return;
      }
      var png = _this.$refs.signature.save();
      if (this.code == "" || this.code == null) {
        Toast({
          message: "验证码不能为空"
        });
        return;
      }
      if (this.planname != this.username) {
        if (this.qianfa) {
          MessageBox.confirm(
            "计划发货人为" + this.planname + "，确定要代签发货?"
          ).then(action => {
            this.commitData(png);
          });
        }else if (this.qianshou) {
          MessageBox.confirm(
            "计划收货人为" + this.planname + "，确定要代签收货?"
          ).then(action => {
            this.commitData(png);
          });
        }
      } else {

        MessageBox.confirm("该操作将会进行认证签名，确定执行此操作?").then(
          action => {
            this.commitData(png);
          }
        );
      }           
    },
    //提交签名
    commitData(pngData) {
      Indicator.open();
      let param = {
        "stopId": this.zdid,
        "imgData": pngData,
        "name": this.username,
        "phone": this.phone,
        "idcode": this.usercode,
        "openid": this.wxid,
        "checkCode": this.code,
        "longitudeX": this.longitudeX,
        "latitudeY": this.latitudeY,
        };

      let sinUrl = "";
      if (this.qianfa) {
        sinUrl = this.api.signSend;
      } else if (this.qianshou) {
        sinUrl = this.api.signGet;
      }
      this.axios.post(sinUrl, param).then(res => {
        Indicator.close();
        if (res.data.success) {
          this.isSendSign = false;
          let _this = this;
          MessageBox.confirm("操作成功", "提示", false).then(action => {
            this.$router.push({
              name: "uate",
              params: {
                stopId: _this.zdid,
                driverId: _this.driverId,
                driverName: _this.driverName,
                vehicleNo: _this.vehicleNo,
                evaluateName: _this.evaluateName,
                userName:_this.username
              }
            });
          });
        } else {
          Toast({
            message: res.data.message
          });
        }
      });
    },
    photo() {
      this.sheetVisible = true;
    }
  },
  created() {},
  components: {
    "app-drop": DropCompontent,
    VueImgInputer
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

bg-col = #2166ff;

.canvas {
  width: 100%;
  height: px2rem(550px);
  position: relative;
  border-top: 1px solid #d9d9d9;
  margin-top: px2rem(42px);
  background-color: #ffffff;

  span {
    position: absolute;
    top: px2rem(20px);
    left: px2rem(20px);
    font-size: px2rem(30px);
    color: #d9d9d9;
  }

  .but {
    position: absolute;
    bottom: px2rem(40px);
    left: 0;
    padding: 0 px2rem(60px);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    button:first-child {
      float: left;
      width: 45%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      background-color: #383838;
      border-radius: px2rem(10px);
      color: #ffffff;
      font-size: px2rem(36px);
    }

    button:nth-child(2) {
      float:right;
      width: 45%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      background-color: bg-col;
      border-radius: px2rem(10px);
      color: #ffffff;
      font-size: px2rem(36px);
    }

    div:last-child {
      float: right;
      position: relative;
      width: 30%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      background-color: bg-col;
      border-radius: px2rem(10px);

      span {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
        z-index: 1;
        color: #ffffff;
        font-size: px2rem(36px);
      }

      // .int {
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%;
      //   z-index: 2;
      //   opacity: 0;
      // }
    }
  }

  .but1 {
    position: absolute;
    bottom: px2rem(40px);
    left: 0;
    padding: 0 px2rem(60px);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    button:first-child {
      float: left;
      width: 46%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      background-color: #383838;
      border-radius: px2rem(10px);
      color: #ffffff;
      font-size: px2rem(36px);
    }

    button:last-child {
      float: right;
      position: relative;
      width: 46%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      background-color: bg-col;
      border-radius: px2rem(10px);
      color: #fff;
      font-size: px2rem(36px);
    }
  }

  .bnt {
    position: absolute;
    bottom: px2rem(40px);
    left: 0;
    padding: 0 px2rem(20px);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    button {
      width: 48%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      border-radius: px2rem(10px);
      color: #ffffff;
      font-size: px2rem(36px);
    }

    button:first-child {
      float: left;
      background-color: bg-col;
    }

    button:last-child {
      float: right;
      background-color: #061128;
    }
  }
}

.zezhao {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

// 控制弹框操作
.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter {
  transform: translateY(100%);
}

.fade-leave-to {
  transform: translateY(100%);
}
</style>

