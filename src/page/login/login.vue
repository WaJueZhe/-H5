<template>
  <div>
    <app-login></app-login>
    <div class="login">
      <div class="logon">
        <img src="../../assets/img/icn_logo@2x.png">
      </div>
      <div class="inpt">
        <div class="int1">
          <span>手机号</span>
          <input type="text" placeholder="输入手机号码" v-model="mobile">
        </div>
        <div class="int2">
          <span>验证码</span>
          <input type="text" placeholder="输入验证码" v-model="vcode">
          <button v-if="flag" @click="getVcode" :disabled="!flag">获取验证码</button>
          <dd class="munt" v-if="!flag">({{ time }})</dd>
        </div>

      </div>
      <div class="input-box" style="margin-top:15px;position: relative;height:20px">
        <input class="agree" type="checkbox" v-model="isAgree">
        <span class="agreetext">我同意《
          <a :href="api.loginUsageDocUrl">云单使用协议</a>》《
          <a :href="api.loginPrivacyDocUrl">隐私保护协议</a>》</span>
      </div>
      <!-- <div class="point">
        <span>收不到短信?</span>
        <a href="javascript:;">点击获取语言验证码</a>
      </div> -->
      <div class="but">
        <button class="loginbt" @click="choseOrg">登录</button>
      </div>

      <div class="register" @click="gotoRegister">新用户注册</div>
    </div>
    <mt-actionsheet :actions="orgdata" v-model="sheetVisible">
    </mt-actionsheet>
    <mt-actionsheet :actions="identitydata" v-model="identityVisible">
    </mt-actionsheet>
  </div>
</template>

<script>
import Vue from "vue";

import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { Actionsheet } from "mint-ui";
Vue.component(Actionsheet.name, Actionsheet);
export default {
  data() {
    return {
      mobile: "",
      vcode: "",
      isAgree: false,
      wxOpenId: "",
      org: "",
      identityTypes: [],//  登录用户所有的身份类型：可能有两个或一个（pcuser、customer、driver）
      identityType:"", //  选择登录的某一身份，：pcuser、customer、driver 其中之一
      identityId:"",   //  选择登录的某一身份信息id
      identityMap: new Map(), //  登录身份信息,返回的原始的数据
      orgArray: [],
      identitydata: [], //  登录身份信息,处理后显示的信息
      orgdata: [],
      sheetVisible: false,
      identityVisible: false,
      flag: true,
      time: ""
    };
  },
  methods: {
    changeOrg(actions, index) {
      this.org = actions.oid;
      if (actions.loginType == "0") {
        this.login();
      } else if (actions.loginType == "1") {
        this.loginWeixin();
      }
    },
    changeIdentity(actions, index) {
      //console.log("进入 选择 身份之后的方法")
      console.table(actions)
      if (actions.loginType == "0") {
        this.identityId = actions.oid;
        this.identityType = actions.loginIdentityType; // 选择身份确定身份类型 
        
        if (this.orgArray.length == 0) {
          //游客登录
          //console.log("游客登录");
        }
        if(actions.loginIdentityType == "driver"){
          if (this.orgArray.length == 1) {
            let orgIdName = this.orgArray[0].split("|");
            this.org = orgIdName[0];
            //console.log("长度是1登录")
            this.login();
          }
          if (this.orgArray.length > 1) {
            this.identityVisible = false;
            this.sheetVisible = true;
            //选择登录的org
            this.orgdata = [];
            for (let i = 0; i < this.orgArray.length; i++) {
              let orgIdName = this.orgArray[i].split("|");
              let obj = {
                name: orgIdName[1],
                oid: orgIdName[0],
                loginType: "0",
                method: this.changeOrg
              };
              //console.log("一个value")
              console.table(obj)
              this.orgdata.unshift(obj);
            }
          }
        }else if(actions.loginIdentityType == "pcuser" || actions.loginIdentityType == "customer"){
          // 具体身份类型是:pcuser还是:customer,在进入方法时已确定，所以login()前不用设置了
          this.login();
        }
      } else if (actions.loginType == "1") {
        this.loginWeixin();
      }
    },
    choseOrg() {
      if (!this.isAgree) {
        Toast("请先阅读并同意云单使用协议、隐私保护协议！");
      } else if (
        this.mobile == "" ||
        this.mobile == null ||
        this.vcode == "" ||
        this.vcode == null
      ) {
        Toast("手机和验证码不能为空!");
      } else {
        // 1、  多个身份，选择身份
        // 1.1、多个身份，选择身份 -> pcuser或customer -> 直接登录
        // 1.2、多个身份，选择身份 -> driver           -> 只有一个机构 -> 直接登录
        // 1.3、多个身份，选择身份 -> driver           ->     多个机构 -> 选择机构 -> 登录
        // 2、  只有一个身份，判断身份 
        // 2.1、只有一个身份:pcuser或customer -> 直接登录
        // 2.2.1、只有一个身份:driver -> 只有一个机构 -> 直接登录
        // 2.2.1、只有一个身份:driver ->     多个机构 -> 选择机构 --> 登录
        if (Object.keys(this.identityMap).length > 1) { //选择登录的身份
          this.identityVisible = true;
          this.identitydata = [];
          for (var key in this.identityMap) {
              //console.log(this.identityMap[key]); 
              let obj = {}; 
              if(key == "pcuser"){
                obj = {
                  name: "货主",//this.identityMap[key].userName,
                  oid: this.identityMap[key].id,
                  loginType: "0",
                  loginIdentityType: "pcuser",
                  method: this.changeIdentity
                };
              }else if(key == "driver"){
                obj = {
                  name: "司机", // 司机是一个列表，不同公司的司机
                  oid: "driverId", // 还要选择哪个企业id
                  loginType: "0",
                  loginIdentityType: "driver",
                  method: this.changeIdentity
                };
              }else if(key == "customer"){
                obj = {
                  name: "货主",//this.identityMap[key].userName,
                  oid: this.identityMap[key].id,
                  loginType: "0",
                  loginIdentityType: "customer",
                  method: this.changeIdentity
                };
              }
            this.identitydata.unshift(obj);
          }
        } else if (Object.keys(this.identityMap).length == 1) {
          // 只有一个身份:pcuser或customer -> 直接登录
          // 只有一个身份:driver -> 只有一个机构 -> 直接登录
          // 只有一个身份:driver ->     多个机构 -> 选择机构 --> 登录
          if(this.identityTypes.contain("pcuser")){
            this.identityType = "pcuser";
            //console.log("直接登录："+this.identityTypes)
            this.login();
          }else if(this.identityTypes.contain("customer")){
            this.identityType = "customer";
            //console.log("直接登录："+this.identityTypes)
            this.login();
          }else if(this.identityTypes.contain("driver")){
            this.identityType = "driver";
            if (this.orgArray.length == 1) { // 司机只有一个机构直接登录
              //console.log("直接登录：driver" )
              let orgIdName = this.orgArray[0].split("|");
              this.org = orgIdName[0];
              this.login();
            }else if (this.orgArray.length > 1) { // 司机只有多个机构 选择登录
              this.sheetVisible = true;
              //选择登录的org
              this.orgdata = [];
              for (let i = 0; i < this.orgArray.length; i++) {
                let orgIdName = this.orgArray[i].split("|");
                let obj = {
                  name: orgIdName[1],
                  oid: orgIdName[0],
                  loginType: "0",
                  method: this.changeOrg
                };
                this.orgdata.unshift(obj);
              }
            } else {
              Toast("司机的机构错误："+this.orgArray);
            }
          }else{
            //console.log("未知登录身份类型："+this.identityTypes);
            Toast("重新获取验证码");
          }
        } else {
          // 登录身份信息为空（司机、pc、c端）
          // //console.log("游客登录");
          Toast("登录身份信息为空,请联系管理员!");
          return;
        }
        console.table(this.identitydata)

        // if (this.orgArray.length == 0) {
        //   //游客登录
        //   //console.log("游客登录");
        // }
      }
    },
    //普通登录
    login() {
      Indicator.open();
      let param = {
        "phone":this.mobile,
        "openId": this.wxOpenId, // 有openid 表示从微信接口进
        "loginType": '0',
        "orgId": this.org,
        "checkCode": this.vcode,
        "identityType":this.identityType,
        "identityId":this.identityId
      };
      console.log("login openid = "+this.wxOpenId)

      let that = this;
      this.axios.post(`${this.api.loginByPhone}`, param).then(res => {
        Indicator.close();
        console.log(res);
        if (res.data.code == 200) {
          let authid = res.headers.authid;
          if (res.data.data.isFirstLogin == "1") {
            this.$store.state.isFirstLogin = true;
          }
          if (res.data.data.isFirstLoginUser == "1") {
                this.$store.state.isFirstLoginUser = true;
          }
          setCookie("authId",authid,7*24*60*60*1000);
          setCookie("phone", that.mobile, 7*24*60*60*1000);
          setCookie("orgId", that.org, 7*24*60*60*1000); // 司机登录机构id 
          setCookie("identityType", this.identityType, 7*24*60*60*1000); // 登录身份写到cookie 
          this.$store.isdemouser=false;
          
          if(this.identityType == "pcuser"){
            console.log(" 返回 权限集 res.data.data.result.permitsMap = "+ JSON.stringify(res.data.data.result.permitsMap))
            //权限集
            let permitsMap = res.data.data.result.permitsMap //格式：{"key1":[],"key2":[]} ,例如:{"extra_service_list":["1"],"userAllMenuCodes":["m008001","m008"]}
            var permitsMapStr = JSON.stringify(permitsMap);
            setCookie("permitsMap", permitsMapStr, 7*24*60*60*1000);
            // //console.log("cookiePermitsMap.userAllMenuCodes = "+ getPermitsByType("userAllMenuCodes"))
            // //console.log("cookiePermitsMap.userAllMenuCodes.contain('m002002') = "+ getPermitsByType("userAllMenuCodes").contain("m002002"))
          } else {
            delCookie("permitsMap");// 清除 pcuser 的权限信息
          }

          switch (this.identityType) {
              case 'pcuser':
                  this.$router.push('/c_page/deliver/deliverHome');
              break;
              case 'customer':
                  this.$router.push('/c_page/deliver/deliverHome');
              break;  
              case 'driver':
                  this.$router.push('/task0');
              break;                     
              default:
              break;
          }
        } else if(res.data.code == 400){
          that.cleanCookie();
          Toast("登录出错,"+res.data.message);
        } else {
          that.cleanCookie();
          Toast("登录出错,未知异常!");
        }
      });
    },
    cleanCookie(){
      // 删除cookie 
      delCookie("authId");
      delCookie("phone");
      delCookie("tokenid"); 
      delCookie("identityType"); // 切换的身份写到cookie  
      delCookie("orgId"); // 司机登录机构id 
      delCookie("permitsMap");// 清除 pcuser 的权限信息
    },
    autoLogin(){
      let authid = getCookie("authId"); 
      let phone = getCookie("phone");
      let tokenid = getCookie("tokenid");
      let identityType = getCookie("identityType");
      let orgId = getCookie("orgId");
      
      let that = this;
      this.wxOpenId = this.GetQueryString("openid");
      console.log("autoLogin this.wxOpenId = "+this.wxOpenId)
      if (this.wxOpenId) {
        this.$store.wxopenid = this.wxOpenId;
      }

      console.log(identityType)
      // 有openid 表示从微信接口进来，那么服务session过期，也自动登录
      // session过期之后，自动登录参数：
      //          openid   必要项
      //          identityType   必要项
      //          orgId   当 identityType的值为"driver"时，此项为 必要项

      // 之前tokenid已经切换，再次进入，直接切换
      if(identityType == "driver"){
        if(authid && phone && tokenid && orgId){
          let  param = {
            "phone": phone,
            "orgId": orgId,
            "identityType": identityType,
            "openId": this.wxOpenId, // 有openid 表示从微信接口进
            "loginType":"0"
          }
          this.axios.post(`${this.api.baseURL}/userAuth/switchIdentity`, param).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$store.state.driverLogin = true;
              this.$store.state.ownerLogin = false;
              this.$router.push("/task0");

              authid = res.headers.authid;
              if (res.data.data.isFirstLogin == "1") {
                this.$store.state.isFirstLogin = true;
              }
              if (res.data.data.isFirstLoginUser == "1") {
                this.$store.state.isFirstLoginUser = true;
              }  
              let tokenid = res.headers.tokenid;
            console.log("switch driver, tokenid =  "+tokenid);
              setCookie("tokenid", tokenid, 7*24*60*60*1000); // 切换用户，有可能是服务器sesssion过期，通过openid进行换，这样服务器重新生成tokenid,所以在这重新保存一次
              setCookie("authId",authid,7*24*60*60*1000);
              setCookie("phone", phone, 7*24*60*60*1000);
              setCookie("orgId", orgId, 7*24*60*60*1000); // 司机登录机构id 
              setCookie("identityType", identityType, 7*24*60*60*1000); // 切换的身份写到cookie 
              this.$store.isdemouser=false;
              //console.log("自动登录切换成功,driver")
            } else if(res.data.code == 400){
              that.cleanCookie();
              //console.log("自动登录 司机 切换出错,"+res.data.message);
            } else {
              that.cleanCookie();
              //console.log("自动登录 司机 切换出错, exception ,"+res.data.message);
            }
          });
        } else {
          that.cleanCookie();
          //console.log("司机cookie保存的数据不完全，不能自动登录,authid="+authid+" ,phone = "+phone +" ,tokenid = "+tokenid + " ,identityType = "+identityType + " ,orgId = "+orgId)
        }
        // 清除 pcuser 的权限信息
        delCookie("permitsMap");
      } else if (identityType == "pcuser" || identityType == "customer") {
        if(authid && phone && tokenid){
          let  param = {
            "phone": phone,
            "identityType": identityType,
            "openId": this.wxOpenId // 有openid 表示从微信接口进
          }

          this.axios.post(`${this.api.baseURL}/userAuth/switchIdentity`, param).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              if(identityType == "pcuser"){
                //权限集
                let permitsMap = res.data.data.result.permitsMap //格式：{"key1":[],"key2":[]} ,例如:{"extra_service_list":["1"],"userAllMenuCodes":["m008001","m008"]}
                var permitsMapStr = JSON.stringify(permitsMap);
                setCookie("permitsMap", permitsMapStr, 7*24*60*60*1000);
                // //console.log("cookiePermitsMap.userAllMenuCodes = "+ getPermitsByType("userAllMenuCodes"))
                // //console.log("cookiePermitsMap.userAllMenuCodes.contain('m002002') = "+ getPermitsByType("userAllMenuCodes").contain("m002002"))
              } else {
                delCookie("permitsMap");// 清除 pcuser 的权限信息
              }

              this.$store.state.driverLogin = false;
              this.$store.state.ownerLogin = true;
              this.$router.push({ path:'/c_page/receive/ownerHome' });

              let authid = res.headers.authid;
              if (res.data.data.isFirstLogin == "1") {
                this.$store.state.isFirstLogin = true;
              }
              if (res.data.data.isFirstLoginUser == "1") {
                this.$store.state.isFirstLoginUser = true;
              }  
              let tokenid = res.headers.tokenid;
            console.log("switch pcuser, tokenid =  "+tokenid);
              setCookie("tokenid", tokenid, 7*24*60*60*1000); // 切换用户，有可能是服务器sesssion过期，通过openid进行换，这样服务器重新生成tokenid,所以在这重新保存一次
              setCookie("authId",authid,7*24*60*60*1000);
              setCookie("phone", phone, 7*24*60*60*1000);
              setCookie("identityType", identityType, 7*24*60*60*1000); // 切换的身份写到cookie 
              //console.log("自动登录切换成功,"+identityType)
            } else if(res.data.code == 400){
              that.cleanCookie();
              //console.log("自动登录 客户 切换出错,"+res.data.message);
            } else {
              that.cleanCookie();
              //console.log("自动登录 客户 切换出错, exception ,"+res.data.message);
            }
          });
        } else {
          that.cleanCookie();
          //console.log("客户cookie保存的数据不完全，不能自动登录,authid="+authid+" ,phone = "+phone +" ,tokenid = "+tokenid + " ,identityType = "+identityType + " ,orgId = "+orgId)
        }
      } else {
        that.cleanCookie();
      }
    },
    //微信登录
    loginWeixin() {
      Indicator.open("加载中...");
      let param = {
        "phone":this.mobile,
        "oepnId": this.wxOpenId,
        "loginType": '0',
        "orgId": this.org
      };

      let that = this;
      this.axios.post(`${this.api.loginByWeixin}`, param).then(res => {
        Indicator.close();
        console.log(res)
        if (res.data.success) {
          let tokenid = res.headers.tokenid;
          let authid = res.headers.authid;
          if (res.data.data.isFirstLogin == "1") {
            this.$store.state.isFirstLogin = true;
          }
          if (res.data.data.isFirstLoginUser == "1") {
                this.$store.state.isFirstLoginUser = true;
          } 
          //setCookie("orgId", this.org, 7*24*60*60*1000); // 司机登录机构id 
          setCookie("tokenid", tokenid, 7*24*60*60*1000);
          setCookie("authId", authid, 7*24*60*60*1000);
          setCookie("phone", that.mobile, 7*24*60*60*1000);
          this.$store.isdemouser=false;
          // window.location.href=this.api.h5url+"task0";
          this.$router.push("/task0");
        } else {
          this.$router.push("/");
        }
      });
    },
    //提交用户信息并跳转到首页
    getVcode() {
      if (!this.isAgree) {
        Toast("请先阅读并同意云单使用协议、隐私保护协议！");
      } else if (this.mobile == "" || this.mobile == null) {
        Toast("手机号码不能为空！");
      } else {
        Indicator.open();
        let param = {
          "phone":this.mobile
        };

        this.axios.post(`${this.api.getloginVcode}`, param).then(res => {
          //console.log(res);
          Indicator.close();
          if (res.data.code == 200) {
            // 407 
            Toast("短信发送成功!");
            // 倒计时开始
            this.code();
            let orgs = res.data.data.orgs;
            this.orgArray = orgs.split(",");
            //console.log("反回的机构：")
            console.table(this.orgArray)

            let tokenid = res.headers.tokenid;
            console.log("send checkcode tokenid =  "+tokenid)
            setCookie("tokenid", tokenid, 7*24*60*60*1000);
            this.identityMap = res.data.data.userIdentity.loginUserAllIdentity;
            this.identityTypes = res.data.data.identityTypes;
          } else {
            Toast(res.data.message);
          }
        });
      }
    },
    //序列化字符串
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
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
    },
    gotoRegister(){
      this.$router.push("/register");
    }
    
  },
  mounted() {
    // this.judegWeixin();
    this.autoLogin();
  }
};
</script>

<style scoped lang="stylus">
@import '../../components/stylus/mixins.styl';

a {
  color: blue;
}

.agreetext{
    position: absolute;
    // top: px2rem(8px);
    left: px2rem(170px);
}
.agree{
    position: absolute;
    top: px2rem(8px);
    left: px2rem(130px);
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
  margin-top: px2rem(100px);
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
    border-bottom: 1px solid #d9d9d9;
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
      border: 1px solid #d9d9d9;
      font-size: px2rem(24px);
      border-radius: px2rem(4px);
      background-color: #fff;
      color: col;
    }
  }
}

// 提示
.point {
  width: 100%;
  margin-top: px2rem(30px);
  font-size: px2rem(24px);
  text-align: center;
  color: col;

  a {
    color: #3070ff;
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

.register {
  margin-top:px2rem(30px);
  color:#777;
}
</style>



