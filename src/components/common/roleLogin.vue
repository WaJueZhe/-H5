<template>
  <div class="cut">
    <div class="driver" @click="driver" :class="{ active: driverLogin}" v-if="this.identityTypes.contain('driver')">
      <i class="iconfont icon-gerenzhongxin"></i>
      <div>我是司机</div>
    </div>
    <div class="owner" @click="owner" :class="{ active: ownerLogin}" v-if="this.identityTypes.contain('driver') && (this.identityTypes.contain('pcuser') || this.identityTypes.contain('customer'))">
        <i class="iconfont icon-all"></i>
        <div>我是货主</div>
    </div>
    
    <mt-actionsheet :actions="orgdata" v-model="sheetVisible">
    </mt-actionsheet>
  </div> 
</template>
<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";

export default {
  data () {
    return {
      sheetVisible: false,
      identityTypes: [], //用户所有的身份类型：pcuser、customer、driver
      userType: "", // 非司机身份，值是：pcuser 或 customer
      identityType:"", //  当前切换的身份：pcuser、或customer、或driver
      org: "",
      orgdata: [],
      driverLogin:this.$route.path == '/task0',
      ownerLogin:this.$route.path == '/c_page/receive/ownerHome'
    }
  },
  methods: {
    getUserIdentitys(){
      let param = { "phone": getCookie("phone") };
      let that = this;
      this.axios.post(`${this.api.baseURL}/userAuth/getUserIdentitys`, param).then(res => {
        if (res.data.code == 200) {
          this.identityTypes = res.data.data.identityTypes; //所有的身份类型数组
          //console.log("返回 identityTypes = "+this.identityTypes)
          for(let i=0; i<this.identityTypes.length ;i++ ){
            if(this.identityTypes[i] != "driver"){
              this.userType = this.identityTypes[i]; //身份不是司机就是：pcuser或customer,直接设置值 
            }
          }
          //console.log("key ========="+ this.userType)
        } else {
          Toast("查询所有身份类型出错");
          //console.log(res.data.message)
        }
      });
    },
    switchIdentity() {
      Indicator.open();
      let param = {};
      if(this.identityType == "driver"){ //  当前切换的身份：pcuser、customer、driver
        param = {
          "phone": getCookie("phone"),
          "orgId": this.org,
          "identityType": this.identityType
        }
        let that = this;
        this.axios.post(`${this.api.baseURL}/userAuth/switchIdentity`, param).then(res => {
          Indicator.close();
          //console.log(res);
          if (res.data.code == 200) {
            let authid = res.headers.authid;
            if (res.data.data.isFirstLogin == "1") {
              this.$store.state.isFirstLogin = true;
            } 
            setCookie("authId",authid,7*24*60*60*1000);
            setCookie("orgId",this.org,7*24*60*60*1000);//司机登录机构
            setCookie("identityType", this.identityType, 7*24*60*60*1000); // 切换的身份写到cookie 
            this.$store.isdemouser=false;
            
            this.$store.state.driverLogin = true;
            this.$store.state.ownerLogin = false;
            console.log("this.$route.path ="+this.$route.path)
            console.log("this.$router.path ="+this.$router.path)
            

            if(this.$route.path == "/task0"){
              window.location.reload(); // 如果司机切换公司，不刷新页面，所以先刷新一下 
            }
            this.$router.push("/task0");
          } else if(res.data.code == 400){
            Toast("切换出错,"+res.data.message);
          } else {
            Toast("切换出错!");
            //console.log(res.data.message)
          }
        });
        // 清除 pcuser 的权限信息
        delCookie("permitsMap");
      } else if(this.identityType == "pcuser" || this.identityType == "customer"){ //  身份：pcuser、customer、driver
        param = {
          "phone": getCookie("phone"),
          "identityType": this.identityType //进入 页面时已设置类型 
        }
        let that = this;
        this.axios.post(`${this.api.baseURL}/userAuth/switchIdentity`, param).then(res => {
          Indicator.close();
          //console.log(res);
          if (res.data.code == 200) {
            if(this.identityType == "pcuser"){
              console.log(" 返回 权限集 res.data.data.result.permitsMap = "+ JSON.stringify(res.data.data.result.permitsMap))
              //权限集
              let permitsMap = res.data.data.result.permitsMap //格式：{"key1":[],"key2":[]} ,例如:{"extra_service_list":["1"],"userAllMenuCodes":["m008001","m008"]}
              var permitsMapStr = JSON.stringify(permitsMap);
              setCookie("permitsMap", permitsMapStr, 7*24*60*60*1000);
              // //console.log("cookiePermitsMap.userAllMenuCodes = "+ getPermitsByType("userAllMenuCodes"))
              // //console.log("cookiePermitsMap.userAllMenuCodes.contain('m002002') = "+ getPermitsByType("userAllMenuCodes").contain("m002002"))
            } else {
              // 清除 pcuser 的权限信息
              delCookie("permitsMap");
            }

            let authid = res.headers.authid;
            if (res.data.data.isFirstLogin == "1") {
              this.$store.state.isFirstLogin = true;
            } 
            setCookie("authId",authid,7*24*60*60*1000);
            setCookie("identityType", that.identityType, 7*24*60*60*1000); // 切换的身份写到cookie 
            this.$store.isdemouser=false;

            this.$store.state.driverLogin = false;
            this.$store.state.ownerLogin = true;
            this.$router.push({ path:'/c_page/receive/ownerHome' });

          } else {
            Toast("切换出错");
            //console.log(res.data.message)
          }
        });
      }else {
        Toast("未知的身份类型：[ "+this.identityType+" ]");
      }

    },
    changeOrg(actions, index) {
      this.org = actions.oid;
      this.identityType = "driver"; //  身份：pcuser、customer、driver
      this.switchIdentity();
    },
    getDriverCustOrgs(){
        this.sheetVisible = true;
        let param = {
          "phone": getCookie("phone")
        };
        this.axios.post(`${this.api.baseURL}/userAuth/getDriverCustOrgs`, param).then(res => {
          //console.log(res);
          Indicator.close();
          if (res.data.code == 200) {
            //console.log("返回数据："+res.data.data.orgs)

            if (Object.keys(res.data.data.orgs).length == 0) {
              Toast("无司机信息！");
            }else{ 
              //选择登录的org
              this.orgdata = [];
              let reorgs = res.data.data.orgs
              for(let key in reorgs){
                //console.log("属性：" + key + ",值：" + reorgs[key]);
                let obj = {
                  name: reorgs[key],
                  oid: key,
                  loginType: "0",
                  method: this.changeOrg
                };
                this.orgdata.unshift(obj);
              }
            }
          } else {
            Toast(res.data.message);
          }
        });
    },
    owner(){
      this.identityType = this.userType; // 首次进入页面，就查询返回所有身份类型,设置this.userType 
      this.switchIdentity();
    },
    driver(){
      this.getDriverCustOrgs();
    },
    initPage(){
      if(getCookie("identityType") == "driver"){
        this.$store.state.driverLogin = true;
        this.$store.state.ownerLogin = false;
        this.$router.push("/task0");
      }else {
        this.$store.state.driverLogin = false;
        this.$store.state.ownerLogin = true;
        if (this.$route.path != '/c_page/deliver/deliverHome'){
          this.$router.push({ path:'/c_page/receive/ownerHome' });
        }
      }
    }
  },
  mounted() {
    this.getUserIdentitys();
    this.initPage();
    }
}
</script>
<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.cut {
  position: fixed;
  bottom:px2rem(40px);
  left:0;
  width: px2rem(400px);
  display:flex;
  justify-content:space-between;
  box-sizing:border-box;

  .driver {
    flex:1;
    text-align:center;

    > i {
      font-size:px2rem(40px);
    }
  }

  .active {
    color:blue;
  }

  .owner {
    flex:1;
    text-align:center;

    > i {
      font-size:px2rem(40px);
    }
  }
}
</style>

