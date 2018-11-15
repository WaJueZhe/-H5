<template>
  <div>
    <div class="head">
      <div class="titl">
        <h2>欢迎体验</h2>
      </div>
      <div>
        <a @click="choseOrg" class="bgzu">登录</a>
      </div>
    </div>
    <div class="login">
      <!-- <div class="logon">
        <img src="../../assets/img/icn_logo@2x.png">
      </div> -->
      <div class="inpt">
        <div class="int1">
          <span>姓&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          <input type="text" placeholder="输入姓名" v-model="name">
        </div>
        <div class="int1">
          <span>手机号</span>
          <input type="text" placeholder="输入手机号码" v-model="mobile">
        </div>
        <div class="int2">
          <span>验证码</span>
          <input type="text" placeholder="输入验证码" v-model="vcode">
          <button v-if="flag" @click="getVcode()" :disabled="!flag">获取验证码</button>
          <dd class="munt" v-if="!flag">({{ time }})</dd>
        </div>
      </div>
    </div>
    <mt-actionsheet :actions="orgdata" v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { setCookie } from "../../js/cookie.js";
import { Actionsheet } from "mint-ui";
Vue.component(Actionsheet.name, Actionsheet);
export default {
  data() {
    return {
      name:"",
      mobile: "",
      vcode: "",
      flag: true,
      time: "",
      org: "",
      orgArray: [],
      orgdata: [],
      sheetVisible: false
    };
  },
  methods: {
    //提交用户信息并跳转到首页
    getVcode() {
      if (this.mobile == "" || this.mobile == null) {
        Toast("手机号码不能为空！");
      } else {
        Indicator.open();
        let param = {
          "phone":this.mobile
        };

        this.axios
          .post(`${this.api.baseURL}/userAuth/demologinSendCheckCodeh5`, param)
          .then(res => {
            console.log(res);
            Indicator.close();
            if (res.data.code == 200) {
              Toast("短信发送成功!");
              // 倒计时开始
              this.code();
              let orgs = res.data.data.orgs;
              this.orgArray = orgs.split(",");
            } else {
              Toast(res.data.message);
            }
          });
      }
    },
    changeOrg(actions, index) {
      this.org = actions.oid;
      this.login();
    },
    login() {
      if(this.name == "" || this.name == null){
        Toast("姓名不能为空！");
      }
      else if (this.mobile == "" || this.mobile == null) {
        Toast("手机号码不能为空！");
      } else if (this.vcode == "" || this.vcode == null) {
        Toast("验证码不能为空！");
      } else {
        Indicator.open();
        let param = {
          "orgId":this.org,
          "phone":this.mobile,
          "name":this.name,
          "openId":this.$store.wxopenid,
          "loginType":'0',
          "dmouser":"1",
          "checkCode":this.vcode
        };

        let that = this;
        this.axios
          .post(`${this.api.baseURL}/userAuth/loginPhoneInsureCheckCodeh5`, param)
          .then(res => {
            console.log(res);
            Indicator.close();
            if (res.data.code == 200) {
              let tokenid = res.headers.tokenid;
              setCookie("tokenid", tokenid, 7*24*60*60*1000);
              setCookie("phone", that.mobile, 7*24*60*60*1000);
              this.$store.isdemouser=true;
              this.$store.showdemobox = true;
              // window.location.href=this.api.h5url+"task0";
              this.$router.push("/task0");
            } else {
              Toast(res.data.message);
            }
          });
      }
    },
    choseOrg() {
      if (
        this.name == "" ||
        this.name == null 
      ) {
        Toast("姓名不能为空!");
      } else if(

        this.mobile == "" ||
        this.mobile == null 
      ){
        Toast("手机不能为空!");
      } else if(
        this.vcode == "" ||
        this.vcode == null
      ){
        Toast("验证码不能为空!");
      } else {
        if (this.orgArray.length == 0) {
          //游客登录

          Toast("无效的账号！");
        }
        if (this.orgArray.length == 1) {
          let orgIdName = this.orgArray[0].split("|");

          this.org = orgIdName[0];

          this.login();
        }
        if (this.orgArray.length > 1) {
          this.sheetVisible = true;
          //选择登录的org
          this.orgdata = [];
          for (let i = 0; i < this.orgArray.length; i++) {
            let orgIdName = this.orgArray[i].split("|");
            let obj = {
              name: orgIdName[1],
              oid: orgIdName[0],
              method: this.changeOrg
            };
            this.orgdata.unshift(obj);
          }
        }
      }
    },
    // 获取验证码,倒计时开始
    code() {
      this.time = 60;
      this.flag = !this.flag;
      var laoz = setInterval(() => {
        if (this.time <= 0) {
          this.flag = true;
          clearInterval(laoz);
        }
        this.time = --this.time;
      }, 1000);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../components/stylus/mixins.styl';

bg-col = #101a30; // 背景色设置
font-fam = '微软雅黑';
col = #ffffff;

.head {
  position: relative;
  height: px2rem(88px);
  line-height: px2rem(88px);
  background-color: bg-col;
  font-family: font-fam;
  color: col;
  overflow: hidden;
  padding: 0 px2rem(20px);
  text-align: center;

  .titl {
    display: inline-block;

    h2 {
      font-size: px2rem(40px);
      font-weight: normal;
    }
  }

  .bgzu {
    position: absolute;
    top: 0;
    right: px2rem(20px);
    font-size: px2rem(28px);
    font-weight: bold;
    color: col;
  }
}

a {
  color: blue;
}

.login {
  margin-top: px2rem(80px);
  text-align: center;

  .logon img {
    width: px2rem(182px);
  }
}

// 输入框
col = #383838;

.inpt {
  margin-top: px2rem(20px);
  padding: 0 px2rem(60rem);

  div {
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  input {
    width: 100%;
    height: px2rem(80px);
    line-height: px2rem(80px);
    padding-left: px2rem(100px);
    border: none;
    border-bottom: 2px solid #d9d9d9;
    font-size: px2rem(30px);
  }

  span {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-60%);
    font-size: px2rem(30px);
    font-weight: 500;
  }

  .int2 {
    margin-top: px2rem(50px);

    button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      border: 1px solid #d9d9d9;
      font-size: px2rem(24px);
      border-radius: px2rem(10px);
      background-color: #2166ff;
      color: #fff;
      padding: px2rem(10px);
    }

    .munt {
      position: absolute;
      top: 50%;
      right: 0;
      width: px2rem(120px);
      transform: translateY(-50%);
      border: 1px solid #CCCCCC;
      font-size: px2rem(24px);
      border-radius: px2rem(4px);
      background-color: #fff;
      color: col;
    }
  }
}

// 登录按钮
bg-col = #2166ff;

.but {
  width: 100%;
  margin-top: px2rem(40px);

  .loginbt {
    width: px2rem(630px);
    height: px2rem(80px);
    line-height: px2rem(80px);
    background-color: bg-col;
    color: #ffffff;
    font-size: px2rem(30px);
    border-radius: px2rem(10px);
  }
}
</style>



