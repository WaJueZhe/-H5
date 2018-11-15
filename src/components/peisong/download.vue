<template>
  <div class="download-page">
    <div class="download">
      <div class="download-box">
        <div class="download-list">
          <div class="download-item" @click="mail = !mail">
            <div class="item-top"><img src="../../assets/img/u316.png" alt=""></div>
            <div class="item-text">到邮件</div>
          </div>
          <div class="download-item" @click="wechat">
            <div class="item-top"><img src="../../assets/img/u317.png" alt=""></div>
            <div class="item-text">到微信</div>
          </div>
          <div class="download-item" @click="toQQ">
            <div class="item-top"><img src="../../assets/img/u318.png" alt=""></div>
            <div class="item-text">到QQ</div>
          </div>
          <div class="download-item" @click="watchNow">
            <div class="item-top"><img src="../../assets/img/u319.png" alt=""></div>
            <div class="item-text">直接查看</div>
          </div>
        </div>
        <div class="Email" v-show="mail">Email：<input @change="newEmail" type="text" v-model="email"><span @click="sendByEmail" class="send">发送</span></div>
        <div v-show="isIllegal" class="illegal">邮箱地址不合法</div>
        <div class="cancle" @click="$store.state.download = false">取消</div>
        <!-- <div class="cancle" @click="cancel">取消</div> -->
      </div>
    </div>
    <div class="share" v-show="shareBox">
      <!-- <div class="direction"><i class="iconfont icon-skip"></i></div> -->
      <i class="iconfont icon-skip"></i>
      <div class="share-title">
        <i class="iconfont icon-close" @click="shareBox = false"></i>
        点击分享应用
      </div>
      <div class="info">
        <div class="number">1</div>
        <div class="text">点击右上角的<span class="more">···</span>按钮 </div>
      </div>
      <div class="info">
        <div class="number">2</div>
        <div class="text">选择<span>“{{sendWay}}”</span></div>
      </div>
    </div>
  </div>
</template>
<script>

import wx from "weixin-js-sdk";
import { wx_init } from "../../js/weixin.js";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
export default {
  props: ["shpId","downShpNo","userName","docViewUrl","docDownUrl"],
  data () {
    return {
      isIllegal:false,
      email:'',
      mail:false,
      download:false,
      shareBox:false,
      sendWay:'',
      contractArr:[]
    }
  },
  methods: {
    newEmail(){
      this.isIllegal=false;
    },
    //通过email发送
    sendByEmail(){
      if(this.email==null||this.email==''){
        this.isIllegal=true;
        return;
      }
      if(!this.isEmail(this.email)){
        this.isIllegal=true;
        return;
      }

      let p ={shpId:this.shpId,sendTo:this.email,userName:this.userName};
      this.axios
        .post(`${this.api.baseURL}/mail/sendContract`,p)
        .then(res => {
          console.log(res)
        });
      this.$store.state.download = false;
      Toast("合同已发送至邮箱，注意查收");     
      this.$store.state.download = false;
    },
    //检查email邮箱
    isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(str);
    },
    wechat(){
      this.mail = false;
      this.shareBox = true;
      this.sendWay = '发送给朋友';

      let that=this;
      wx.ready(function() {
          wx.onMenuShareAppMessage({
          title: '电子运单-'+that.downShpNo, // 分享标题
          desc: '云单是腾讯与云链共同打造的基于区块供应链联盟链的可信电子运单服务平台', // 分享描述
          link: that.docViewUrl, // 分享链接
          imgUrl: 'https://www.bcscm.net/resource/bcscm_temp/log.jpg', // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            console.log("分享");
            Toast("合同分享到微信");
            that.$store.state.download = false;
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log("取消分享");
          }
        });
      });
    },
    toQQ(){
      this.mail = false;
      this.shareBox = true;
      this.sendWay = '分享到手机QQ'    

      let that=this;
      wx.ready(function() {
        wx.onMenuShareQQ({  
            title: '电子合同-'+that.downShpNo, // 分享标题 
            desc: '云单是腾讯与云链共同打造的基于区块供应链联盟链的可信电子运单服务平台', // 分享描述  
            link: that.docViewUrl, // 分享链接
            imgUrl:'https://www.bcscm.net/resource/bcscm_temp/log.jpg', // 分享图标  
            success: function () {   
              // 用户确认分享后执行的回调函数  
              that.$store.state.download = false;
            },  
            cancel: function () {   
              // 用户取消分享后执行的回调函数  
            }  
        }); 
      });
    },
    watchNow(){
      window.location.href=this.docViewUrl;
    }
  },
  created () {
    let url = location.href.split("#")[0];
    wx_init(url);
  },
  beforeMount () {
    let that=this;
    wx.ready(function() {

      //获取合同信息
      let p ={shpId:that.shpId};
      that.axios
        .post(`${that.api.baseURL}/shipmentContractInf/api/findByShpId`,p)
        .then(res => {
          //console.log(res)
          if(res.data.success){
            that.contractArr = res.data.data.conList;
            if(that.contractArr.length>0){

            }
          }
        });
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

//下载弹框提示
.download-page {
  .download {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.5);
    z-index:3333;

    .download-box {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      width:90%;
      background-color: #fff;
      border-radius:px2rem(10px);
      box-sizing:border-box;
      z-index:4444;

      .Email {
        padding:px2rem(30px);
        font-size:px2rem(30px);
        box-sizing:border-box;

        > input {
          padding-left:px2rem(10px);
          width:px2rem(400px);
          height:px2rem(60px);
          border:1px solid #ccc;
        }

        .send {
          display:inline-block;
          padding:px2rem(15px);
          background-color:#2196F3;
          color:#fff;
        }
      }

      .illegal {
        margin-left:px2rem(100px);
        margin-top:px2rem(-20px);
        padding: 0 px2rem(30px) px2rem(30px) px2rem(30px);
        font-size:px2rem(30px);
        box-sizing:border-box;
        color:red;
      }

      .download-list {
        padding:px2rem(30px);
        width:100%;
        display:flex;
        justify-content:space-between;
        box-sizing:border-box;

        .download-item {
          flex:1;
          margin-right:px2rem(20px);
          width:25%;
          text-align:center;

          &:last-child {
            margin-right:0;
          }

          .item-top {
            margin:auto;
            width:px2rem(110px);
            height:px2rem(110px);
            border-radius:50%;

            > img {
              width:100%;
              height:100%;
            }
          }

          .item-text {
            padding-top:px2rem(20px);
            font-size:px2rem(28px);
            color:#666;
          }
        }
      }

      .cancle {
        width:100%;
        height:px2rem(90px);
        line-height:px2rem(90px);
        text-align:center;
        font-size:px2rem(28px);
        border-top:1px solid #ccc;
      }
    }
  }

  .share {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.7);
    z-index:4444;

    > i  {
      position: absolute;
      top:3%;
      right :5%;
      transform:translate(-50%,-50%);
      // width:px2rem(100px);
      // height:px2rem(100px);
      // background-color: #fff;
      font-size:px2rem(100px);
      color:#fff;
      z-index:5555;
      transform:rotate(-30deg);
    }

    .share-title {
      padding-left:px2rem(10px)
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(40px);
      color:#fff;
      background-color #000;

      > i {
        font-size:px2rem(46px);
        font-weight:bold;
        vertical-align:middle;
      }
    }

    .info {
      margin-top:px2rem(200px);
      padding-left:px2rem(40px);
      height:px2rem(60px);
      box-sizing:border-box;

      &:last-child {
        margin-top:px2rem(60px);
      }

      .number {
        display:inline-block;
        width:px2rem(60px);
        height:px2rem(60px);
        line-height:px2rem(60px);
        text-align:center;
        font-size:px2rem(40px);
        background-color: orange;
        color:#d6d6d6;
        border-radius:50%;
        vertical-align:middle;
      }

      .text {
        padding-left:px2rem(20px);
        display:inline-block;
        height:px2rem(60px);
        line-height:px2rem(60px);
        font-size:px2rem(34px);
        color:#d6d6d6;
        vertical-align:middle;

        .more {
          margin:0 px2rem(10px)
          display:inline-block;
          height:px2rem(60px);
          line-height:px2rem(60px);
          text-align:center;
          font-size:px2rem(80px);
          transform:rotate(-90deg);
          background-color #000;
          border-radius:px2rem(6px);
          vertical-align:middle;
        }
      }
    }
  }
}

</style>

