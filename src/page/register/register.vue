<template>
  <div class="register-page">
    <div class="register-logo">
        <img src="../../assets/img/icn_logo@2x.png">
    </div>
    <div class="select" v-show="driverBox">
      <div class="textCenter">请选择身份</div>
      <div class="diver" @click="driver('driver')">
        <div class="diver-left"><i class="iconfont icon-auto"></i></div>
        <div class="diver-right">我是司机
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>

      <div class="diver" @click="driver('customer')">
        <div class="diver-left"><i class="iconfont icon-gerenzhongxin"></i></div>
        <div class="diver-right">我是货主
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>
    </div>
    
    <div class="phone" v-show="message">
      <div class="mobile">
        <div class="number">姓名</div>
        <div class="input">
          <input type="text" placeholder="请输入您的姓名" v-model="userName">
        </div>
      </div>
      <div class="mobile">
        <div class="number">手机号</div>
        <div class="input">
          <input type="text" placeholder="请输入手机号" :maxlength="11" v-model.number="mobile">
          <!-- <button class="code" @click="gain" :class="{ codeActive: flag}" :disabled="flag">{{code}}</button> -->
        </div>
      </div>
      <div class="mobile">
        <div class="number">验证码</div>
        <div class="input">
          <input type="text" placeholder="请输入验证码" :maxlength="11" v-model="smscode">
          <button class="code" @click="gain" :class="{ codeActive: flag}" :disabled="flag">{{code}}</button>
        </div>
      </div>
      <div class="choose">
        <div class="prev" @click="step">上一步</div>
        <div class="next" :class="{ active: userName && mobile && smscode}" @click="next">下一步</div>
      </div>
      <!-- <div class="next" :class="{ active: name && mobile}" @click="next">下一步</div> -->
    </div>

    <!-- <div class="authentication" v-show="authentication">
      <div class="mobile">
        <div class="number">姓名</div>
        <div class="input">
          <input type="text" placeholder="请输入您的姓名" v-model="userName">
        </div>
      </div>
      <div class="mobile">
        <div class="number">身份证</div>
        <div class="input">
          <input type="text" placeholder="请输入身份证号" :maxlength="18" v-model.number ="identityCard">
        </div>
      </div>
      <div class="affirm" :class="{ affirmActive: userName && identityCard}" @click="saveInfo">保存</div>
    </div> -->

    <!-- 弹框提示是否要实名 -->
    <!-- <div class="autonym-box" v-show="autonymBox">
      <div class="autonym">
        <h4 class="autonym-title">温馨提示：</h4>
        <div class="autonym-msg">您已注册成功，是否要去完善个人信息？</div>
        <div class="autonym-btn">
          <div class="cancel" @click="gotoLogin">跳过</div>
          <div class="cancel" @click="goAttestation">现在就去</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";
export default {
  data () {
    return {
      userName:      '',
      mobile:        '',
      smscode:       '',
      name:          '',
      identityCard:  '',
      code:          '获取验证码',
      flag:          false,
      //authentication: false,
      message: false,
      driverBox: true,
      //autonymBox: false,
      registeredType: 'driver',
      registeredId: '',
    }
  },
  methods: {
    time(){
      var count = 30;
      let self = this;
      var timer = setInterval(function(){
        self.code = '重新发送'+ count--;
        if(count < 0 ){
          self.code = '获取验证码';
          self.flag = false;
          clearInterval(timer);
        }
      },1000);
    },
    gain(){
      if (this.userName == '' || this.userName.length < 2){
        Toast({position: 'bottom', message: '请输入真实姓名'});
        return;
      }
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if(this.mobile == '' || !myreg.test(this.mobile)){
        Toast({
          position: 'bottom',
          message:'请输入正确的手机号码'
        });
        return;
      }
      // 调用后台发送验证码
      let url = this.api.baseURL + '/c_driver/sendSmsCode4Registration';
      if (this.registeredType == 'customer')
        url = this.api.baseURL + '/sysCUser/sendSmsCode4Registration';
      let p = {"phone": this.mobile};
      let that = this;
      this.axios.post(url, p).then(res =>{
        if ((res.status == '200') && (res.data)){
          if ((res.data.code) && (res.data.code == '200')){
            that.flag = true;
            that.time()
            Toast({position: 'bottom', message:'已发送'});
          }else{
            Toast({position: 'bottom', message: res.data.message});
          }
        }else{
          Toast({position: 'bottom', message:'发送短信失败'});
        }
      });
    },
    next(){
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if(this.userName == ''){
        Toast({
          position: 'bottom',
          message:'请输入姓名'
        })
        return;
      }
      if(!myreg.test(this.mobile)){
        Toast({
          position: 'bottom',
          message:'请输入正确的手机号码'
        })
        return;
      }
      if(this.smscode == ''){
        Toast({
          position: 'bottom',
          message:'请输入验证码'
        })
        return;
      }else {
        // 调用后台校验验证码 并保存
        let url = this.api.baseURL + '/c_driver/validateSmsCode4Registration';
        if (this.registeredType == 'customer')
          url = this.api.baseURL + '/sysCUser/validateSmsCode4Registration';
        let p = {"phone": this.mobile, "smsCode": this.smscode, "userName": this.userName};
        let that = this;
        this.axios.post(url, p).then(res =>{
          console.log(res);
          if ((res.status == '200') && (res.data)){
            if ((res.data.code) && (res.data.code == '200')){
              that.registeredId = res.data.data.result;
              //this.autonymBox = true;
              MessageBox.alert('注册成功！').then(action => {
                that.gotoLogin();
              });
            }else{ 
              Toast({position: 'bottom', message: res.data.message});
            }
          }else{
            Toast({position: 'bottom', message:'校验短信码失败'});
          }
        });
        
      }
    },
    gotoLogin(){
      this.$router.push("/");
    },
    driver(registerType){
      this.message = true;
      this.driverBox = false;
      this.registeredType = registerType;
    },
    step(){
      this.message = false;
      this.driverBox = true;
    },
    goAttestation(){
      //this.autonymBox = false;
      //this.authentication = true;
      this.message = false;
    },
    gotoLogin(){
      this.$router.push("/");
    },
    /*saveInfo(){
      let url = this.api.baseURL + '/authent/userAuthentWithoutTokenId';
      let userType = "2";
      if (this.registeredType == "customer")
        userType = "1";
      let p = {"signerName": this.userName, "signerIdcode": this.identityCard, "userType": userType,
               "custId": "0000", "id": this.registeredId};
      this.axios.post(url, p).then(res =>{
        console.log(res);
        if (res.status == "200" && (res.data)){
          if (res.data.success){
            // TBD
            //
          }else{
            Toast({position: 'bottom', message:'认证失败：' + res.data.message});
          }
        }else{
          Toast({position: 'bottom', message:'实名认证失败'});
        }
      });
    }*/
  },
  components: {
  }
}
</script>
<style lang="stylus">
@import '../../components/stylus/mixins.styl';

.register-page {
  width:100%;
  height:100%;

  .register-logo {
    margin:auto;
    margin-top: px2rem(160px);
    width: px2rem(182px);

    > img {
      width:100%;
      
    }
  }

  .textCenter{
    margin-bottom: 20px;
    text-align: center;
    font-size:px2rem(34px);
  }

  .select {
    margin-top:px2rem(40px);
    padding:0 px2rem(40px);
    box-sizing:border-box;

    .diver {
      margin:auto;
      padding:px2rem(40px);
      width:100%;
      height:px2rem(160px);
      border:1px solid #ccc;
      box-sizing:border-box;

      &:last-child {
        margin-top:px2rem(40px);
      }

      &:after {
        display:block;
        clear: both;
        content: ' ';
      }

      .diver-left {
        float: left;
        // position absolute;
        // top:px2rem(50px);
        // left:0;
        width:px2rem(76px);
        height:px2rem(76px);
        line-height:px2rem(76px);
        text-align:center;
        border-radius:50%;
        background-color: #2166ff;
        
        
        > i {
          // padding:px2rem(56px);
          font-size:px2rem(50px);
          color :#fff;
        }
      }
      .diver-right {
        float:right;
        // position absolute;
        // top:px2rem(50px);
        // right:0;
        width:80%;
        height:px2rem(76px);
        line-height:px2rem(76px);
        font-size:px2rem(34px);

        > i {
          float:right;
        }
      }
    }
  }

  .phone {
    margin-top:px2rem(40px);
    padding: 0 px2rem(60px);
    box-sizing:border-box;

    .mobile  {
      position: relative;
      margin-bottom:px2rem(40px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      border-bottom:1px solid #ccc;

      .number {
        position: absolute;
        top:0;
        left:0;
        width:20%;
        height:px2rem(80px);
        line-height:px2rem(80px);
        font-size: px2rem(34px);
        font-weight: 500;
      }

      .input {
        position: absolute;
        top:0;
        right:0;
        width:80%;
        height:100%;

        > input {
          width:100%;
          height:100%;
          font-size:px2rem(34px);
        }

        .code {
          position: absolute;
          top:px2rem(10px);
          right:0;
          min-width:px2rem(190px);
          height:px2rem(70px);
          line-height:px2rem(70px);
          text-align:center;
          font-size:px2rem(32px);
          background-color: #2166ff;
          color :#fff;
          border-radius:px2rem(10px);
          z-index:1111;
        }

        .codeActive {
          background-color: #ccc;
        }
      }
    }
  }

  .authentication {
    margin-top:px2rem(40px);
    padding: 0 px2rem(60px);
    box-sizing:border-box;

    .mobile  {
      position: relative;
      margin-bottom:px2rem(40px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      border-bottom:1px solid #ccc;

      .number {
        position: absolute;
        top:0;
        left:0;
        width:20%;
        height:px2rem(80px);
        line-height:px2rem(80px);
        font-size: px2rem(34px);
        font-weight: 500;
      }

      .input {
        position: absolute;
        top:0;
        right:0;
        width:80%;
        height:100%;

        > input {
          width:100%;
          height:100%;
          font-size:px2rem(34px);
        }
      }
    }

    .affirm {
      margin:auto;
      margin-top:px2rem(80px);
      width:px2rem(200px);
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(32px);
      background-color: #ccc;
      color :#fff;
      border-radius:px2rem(10px);
    }

    .affirmActive {
      background-color: #2166ff;
    }
  }

  .choose {
    margin-top:px2rem(40px);
    padding: 0 px2rem(60px);
    width:100%;
    box-sizing:border-box;
    display:flex;
    justify-content:space-between;

    .prev {
      flex:1;
      margin-right:px2rem(40px);
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(32px);
      border-radius:px2rem(10px);
      color:#fff;
      background-color: #2166ff;
    }

    .next {
      flex:1;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(32px);
      border-radius:px2rem(10px);
      color :#fff;
      background-color: #ccc;
    }

    .active {
      background-color: #2166ff;
    }
  }

  .autonym-box {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
    z-index:1111;

    .autonym {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      padding:0 px2rem(30px);
      width:90%;
      background-color: #fff;
      border-radius:px2rem(10px);
      z-index:2222;
      box-sizing:border-box;

      .autonym-title {
        margin-top:px2rem(10px);
        height:px2rem(60px);
        line-height:px2rem(60px);
        text-align:center;
      }

      .autonym-msg {
        margin-top:px2rem(20px);
        font-size:px2rem(34px);
        text-align:center;
      }

      .autonym-btn {
        margin-top:px2rem(40px);
        width:100%;
        height:px2rem(80px);
        line-height:px2rem(80px);
        display:flex;
        justify-content:space-between;
        border-top:1px solid #ccc;

        .cancel {
          flex:1;
          font-size:px2rem(34px);
          text-align:center;

          &:first-child {
            border-right:1px solid #ccc;
            color:#2166ff;
          }
        }
      }
    }
  }
}
</style>
