<template>
  <div class="signSucceed">
    <!-- <app-comhed :name="name" :operation="operation" :flag="false"></app-comhed> -->
    <h2 class="comment">评论提交成功！</h2>
    <div class="code">
      <img src="../../assets/img/u220.png" alt="">
      <div>长按添加关注</div>
    </div>
    <div class="attention">关注“云单平台”微信公众号</div>
    <div class="shortcut">快捷查单、开单、积分兑换</div>
    <div class="skip">
      <a href="javascript:;" @click="goHome">进入我的云单</a>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name:'签单成功',
      operation:'',
    }
  },
  methods: {
    //进入个人中心
    goHome(){
      if(window.__wxjs_environment === 'miniprogram'){   //判断是否在微信小程序内执行
        wx.miniProgram.navigateBack({
          delta: 1
        })
        return
      }
      window.location.href = `${this.api.baseURL}/wx/wx_mpredirect?reurl=wx_oauth`;
    },
    closeWind(){

      let ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        WeixinJSBridge.invoke("closeWindow", {}, function(res) {
          //alert(res.err_msg);
        });
      } else if (ua.indexOf("alipay") != -1) {
        AlipayJSBridge.call("closeWebview");
      } else if (ua.indexOf("baidu") != -1) {
        BLightApp.closeWindow();
      } else {
        window.close();
      }
    }
  },
  mounted () {
    let that=this;
    window.addEventListener("popstate", function(e) {  
        that.closeWind();
    }, false);
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.signSucceed {
  position: fixed;
  width:100%;
  height:100%;
  background-color:#eee;

  .comment {
    margin-top:px2rem(300px);
    text-align:center;
  }

  .code {
    margin:auto;
    margin-top:px2rem(150px);
    padding:px2rem(20px);
    width:px2rem(240px);
    text-align:center;
    background-color: #fff;
  }

  .attention {
    margin-top:px2rem(80px);
    font-size:px2rem(32px);
    text-align:center;
  }

  .shortcut {
    margin-top:px2rem(20px);
    font-size:px2rem(32px);
    text-align:center;
  }

  .skip {
    margin-top:px2rem(40px);
    font-size:px2rem(30px);
    text-align:center;

    a{
      color :blue;
      text-decoration :underline;
    }
    
  }
}
</style>
