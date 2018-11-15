<template>
  <div class="receiver-page">
    <appHeader></appHeader>
    <transition name="move">
      <appAside v-show="$store.state.toggleaside"></appAside>
    </transition>
    <!-- 遮罩层 -->
    <div class="ceng" v-show="$store.state.toggleaside"></div>
    <div class="sign-in">
      <div class="sign-left">
        <div class="task">运单签收</div>
      </div>
      <div class="sign-right">
        <div class="sign-item" @click="querySum(1)" :class="{ signActive:acticeIndex == 1 }">今天</div>
        <div class="sign-item" @click="querySum(2)" :class="{ signActive:acticeIndex == 2 }">近3天</div>
        <div class="sign-item" @click="querySum(3)" :class="{ signActive:acticeIndex == 3 }">近7天</div>
        <div class="sign-item" @click="modal = !modal">更多<span></span></div>
      </div>
    </div>
    <!-- 更多 -->
    <transition name="fade">
      <div class="modal" v-show="modal">
        <div @click="querySum(4)" :class="{ modalActive:acticeIndex == 4 }">上月</div>
        <div @click="querySum(5)" :class="{ modalActive:acticeIndex == 5 }">本月</div>
      </div>
    </transition>

    <!-- 签收任务列表 -->
    <div class="info-box">
      <div class="info-item" @click="queryData(1)">
        <!-- <router-link :to="{ name: 'c_sign_listHome' }"> -->
          <div class="item-top"><span>{{intransitQty}}</span>单</div>
          <div class="item-bot">在途待签</div>
        <!-- </router-link> -->
      </div>
      <div class="info-item" @click="queryData(2)">
        <!-- <router-link :to="{ name: 'c_sign_listHome' }"> -->
          <div class="item-top"><span>{{signedOK}}</span>单</div>
          <div class="item-bot">正常签收</div>
        <!-- </router-link> -->
      </div>
      <div class="info-item" @click="queryData(3)">
        <!-- <router-link :to="{ name: 'c_sign_listHome' }"> -->
          <div class="item-top"><span>{{signedNonOK}}</span>单</div>
          <div class="item-bot">异常签收</div>
        <!-- </router-link> -->
      </div>
    </div>
    <div @click="go('historyList')">
      <mt-cell class="seeSendList"
        title="" 
        is-link
        value="查看全部">
      </mt-cell>    
    </div>

    <!--一条分割线-->
    <!-- <div class="usuallyWork">
      <div class="sign-left">
        <div class="task">常用功能</div>
      </div>
    </div> -->
    <!--应用展示-->
    <!-- <div class="apps">
      <div @click="go('historyList')" class="apps-item">
        <div class="images"><img src="../../assets/img/receiveList.png"/></div>
        <span>签收记录</span>
      </div>  
    </div> -->
    <!-- 扫描签单 -->
    <div class="scan" @click="scan"><img src="../../assets/img/repayment.png" alt=""> 扫描签单</div>

            <!-- 发货引导组建 -->
    <Guidance v-show="isFirstUser"></Guidance>
  </div>
</template>

<script>
// 配置微信
import { wx_init } from "../../js/weixin.js";
// 引用微信的配置文件
import wx from "weixin-js-sdk";
import header from '../../components/c_componments/receiveHeader';
import aside from '../../components/common/aside';
import moment from "moment";
import { Toast } from "mint-ui";
import { getCookie } from "../../js/cookie.js";
import Guidance from "../../components/indicate/guidance";
let Base64 = require("js-base64").Base64;
export default {
  data () {
    return {
      modal: false,
      //signerTel: "13826454946",
      signerTel: "",
      isFirstUser:this.$store.state.isFirstLoginUser,
      signerTimeBegin: "2017-01-01",
      signerTimeEnd: "2019-12-01",
      searchKey: "",
      isInTransit: "",
      isSignedOK: "",
      intransitQty: 0,
      signedOK: 0,
      signedNonOK: 0,
      acticeIndex: 1
    }
  },
  methods:{
    go(index){
        this.$router.push({
            name: index
        });
    },
    init(){
      this.querySum(1); 
    },
    querySum(typeCode){
      this.acticeIndex = typeCode;
      let dteToday = new Date();
      switch (typeCode) {
        case 1:
          this.signerTimeBegin = moment(dteToday).format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          
          break;
        case 2:
          this.signerTimeBegin = moment().add(-2, "days").format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          console.log('++++'+this.signerTimeBegin)
          console.log('----'+this.signerTimeEnd)
          break;
        case 3:
          this.signerTimeBegin = moment().add(-6, "days").format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        case 4:
          this.signerTimeBegin = moment().add(-1, "months").format("YYYY-MM") + "-01";
          let tmpStr = moment().format("YYYY-MM") + "-01";
          this.signerTimeEnd = moment(tmpStr).add(-1, "days").format("YYYY-MM-DD");
          break;
        case 5:
          this.signerTimeBegin = moment().format("YYYY-MM") + "-01";
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        default:
          break;
      }
      let p = {"signerTel": this.signerTel, "signerTimeBegin": this.signerTimeBegin, "signerTimeEnd": this.signerTimeEnd, "searchKey": ""};
      let that = this;
      this.axios.post(`${this.api.baseURL}/shipment/findCountBydReceiverMob`, p).then(res =>{
        //console.log(res);
        if (res.status == "200"){
          that.intransitQty = 0;
          that.signedOK = 0;
          that.signedNonOK = 0;
          if (res.data.data.result){
            let j = res.data.data.result;
            that.intransitQty = j.non_signed_count;
            that.signedOK = j.signed_ok_count;
            that.signedNonOK = j.signed_ng_count;
            
            // Toast("已为您查询到最新数据！");
          }else{
            Toast("暂无数据！");
          }
        }else{
          // Toast("暂无数据【0】！");
        }
      });
      that.modal = false;
    },
    queryData(typeCode){
      let para = '{"activeTab":' + typeCode + ',"intransitQty":' + this.intransitQty + ',"signedOK":' + this.signedOK + 
          ',"signedNonOK":' + this.signedNonOK + ',"criteria":{"signerTel":"' + this.signerTel + '","signerTimeBegin":"' + this.signerTimeBegin + 
          '","signerTimeEnd":"' + this.signerTimeEnd + '","searchKey":"","pageNo":1,"pageSize":5,'; 
      if (typeCode == 1){
        para = para + '"isInTransit":1}}';
      }
      if (typeCode == 2){
        para += '"isSignedOK":1}}';
      }
      if (typeCode == 3){
        para += '"isSignedOK":0}}';
      }
      //console.log("22")
      //console.log(para);
      this.$router.push("/waybill_list/listHome/" + Base64.encode(para));
      //alert(typeCode);
    },
    scan(){
      let that = this;
      //调用微信接口
      wx.ready(function() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = String(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
            let baseUrl = that.api.baseURL;
            if(result.indexOf(baseUrl)>=0){
              window.location.href=result;
            }else{
              Toast("扫描的二维码不合法");
            }
          }
        });
      });
    }
  },
  created(){
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
    this.signerTel = getCookie("phone");
    this.init();
  },
  mounted(){
    this.signerTel = getCookie("phone");
    console.log('----'+this.signerTel)

    let identityType = getCookie("identityType"); 
    if(identityType!='driver'){
      this.isFirstUser = this.$store.state.isFirstLoginUser;
    }
  },
  components: {
    appHeader:header,
    appAside:aside,
    Guidance:Guidance
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.receiver-page {
  width:100%;
  height:100%;
  padding:0 px2rem(30px);
  box-sizing:border-box;

  .seeSendList {
    margin-right:px2rem(-30px);
  }
  // 签收任务
  .sign-in {
    position: relative;
    padding-bottom:px2rem(10px);
    margin-top:px2rem(180px);
    width:100%;
    height:px2rem(52px);
    border-bottom:1px solid #ccc;
    box-sizing:border-box;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .sign-left {
      padding-bottom:px2rem(4px);
      float: left;
      width:30%;
      height:100%;
      text-align:center;
      // border-bottom:3px solid #000;

      .task {
        font-size:px2rem(40px);
        font-weight:bold;
      }
    }
    .sign-right {
      float:right;
      width:64%;
      display:flex;
      justify-content:space-between;

      .sign-item {
        margin-left:px2rem(10px);
        flex:1;
        text-align:center;
        font-size:px2rem(30px);

        &:first-child {
          margin-left:0;
        }

        > span {
          margin-top:px2rem(14px);
          margin-left:px2rem(4px);
          display:inline-block;
          width:0;
          border-top:7px solid #000;
          border-bottom:7px solid #fff;
          border-left:7px solid #fff;
          border-right:7px solid #fff;
          vertical-align:middle;
        }
      }
    }

    .signActive {
      color:blue;
    }
  }

//常用功能
  .usuallyWork{
    position: relative;
    padding-bottom:px2rem(10px);
    margin-top:px2rem(80px);
    width:100%;
    height:px2rem(52px);
    border-bottom:1px solid #ccc;
    box-sizing:border-box;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .sign-left {
      padding-bottom:px2rem(4px);
      float: left;
      width:30%;
      height:100%;
      text-align:center;
      // border-bottom:3px solid #000;

      .task {
        font-size:px2rem(40px);
        font-weight:bold;
      }
    }
    .sign-right {
      float:right;
      width:60%;
      display:flex;
      justify-content:space-between;

      .sign-item {
        margin-left:px2rem(10px);
        flex:1;
        text-align:center;
        font-size:px2rem(30px);

        &:first-child {
          margin-left:0;
        }

        > span {
          margin-top:px2rem(14px);
          margin-left:px2rem(4px);
          display:inline-block;
          width:0;
          border-top:7px solid #000;
          border-bottom:7px solid #fff;
          border-left:7px solid #fff;
          border-right:7px solid #fff;
          vertical-align:middle;
        }
      }
    }

    .signActive {
      color:blue;
    }   
  }
  // 更多
  .modal {
    position: absolute;
    right:px2rem(30px);
    width:px2rem(96px);
    text-align:center;
    background-color: #eee;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    > div {
      padding:px2rem(10px) 0;
    }

    .modalActive {
      color:blue;
    }
  }
   .apps {
    width:100%;
    

    &:after {
      display:block;
      clear:both;
      content:' ';
    }

    .apps-item {
      margin-top:px2rem(30px);
      float:left;
      width:25%;
      text-align:center;

      .images {
        margin:auto;
        width:px2rem(80px);
        height:px2rem(80px);

        > img {
          width:100%;
          height:100%;
        }
      }

      
    }
  } 

  //签收任务列表
  .info-box {
    width:100%;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .info-item {
      float: left;
      margin-top:px2rem(40px);
      margin-right:px2rem(20px);
      width:31.3333%;
      box-sizing:border-box;
      cursor: pointer;

      &:nth-child(3n) {
        margin-right:0;
      }

      .item-top {
        width:100%;
        height:px2rem(120px);
        line-height:px2rem(120px);
        text-align:center;
        font-size:px2rem(34px);
        border:1px solid #000;
        border-radius:px2rem(10px);
        box-sizing:border-box;

        > span {
          margin-right:px2rem(10px);
          font-size:px2rem(50px);
        }
      }

      .item-bot {
        padding:px2rem(4px) 0;
        margin-top:px2rem(20px);
        width:100%;
        text-align:center;
        font-size:px2rem(28px);
        color:#fff;
        background-color: #000;
        border-radius:px2rem(10px);
        box-sizing:border-box;
      }
    }
  }

  //扫描签单
  .scan {
    position:fixed;
    bottom:px2rem(20px);
    width:92%;
    height:px2rem(90px);
    line-height:px2rem(90px);
    text-align:center;
    font-size:px2rem(32px);
    color:#fff;
    background-color: #008eff;
    border-radius:px2rem(10px);
    box-sizing:border-box;

    > img {
      margin-right:px2rem(10px);
      width:px2rem(50px);
      height:px2rem(50px);
      
    }
  }

  // 遮罩层
  .ceng {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }

  // 左侧动画
  .move-enter-active {
    transition: all 1s;
  }

  .move-leave-active {
    transition: all 1s;
  }

  .move-enter {
    transform: translateX(-100%);
  }

  .move-leave-to {
    transform: translateX(-100%);
  }
  // 更多动画
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
}

</style>
