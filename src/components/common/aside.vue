<template>
  <div class="aside">
      <div class="info">
        <!-- 司机信息 -->
        <div class="user">
            <div class="photo">
                    <img v-if="driver.driverPic != ''&& driver.driverPic !=null" v-bind:src="api.resourceurl+driver.driverPic">
                    <img v-if="driver.driverPic == ''|| driver.driverPic ==null" src="static/user.jpg">
            </div>
            <div class="information">
                <div class="usname">
                     <span v-if="!isdemouser">{{driver.driverName}}</span>
                     <span v-if="isdemouser">演示用户</span>
                    <!-- <button>修改</button> -->
                </div>
                <div class="phone">
                    <span v-if="!isdemouser">{{driver.driverMobile}}</span>
                </div>
            </div>
        </div>
        <!-- 菜单栏 -->
        <div class="renwu">
            <ul v-if=" $route.path == '/task0' ">
                <li>
                    <router-link to="/history">
                        <img src="../../assets/img/侧边栏-我的/icn_task.png" alt=""><span>历史任务</span>
                    </router-link>
                    
                </li>
                <li>
                    <router-link to="/wayall">
                        <img src="../../assets/img/侧边栏-我的/icn_order.png" alt=""><span>运单管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/com">
                            <img src="../../assets/img/侧边栏-我的/icn_account.png" alt=""><span>我的账户</span>
                    </router-link>
                </li>
                <li>
                    <!-- <router-link to="/supportCenter">
                        <img src="../../assets/img/侧边栏-我的/icn_help.png" alt=""><span>帮助中心</span>
                    </router-link> -->
                    <router-link to="/help">
                        <img src="../../assets/img/侧边栏-我的/icn_help.png" alt=""><span>帮助中心</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/com">
                        <img src="../../assets/img/侧边栏-我的/inc_Shopping.png" alt=""><span>积分商城</span>
                    </router-link>
                </li>   
                <li>
                    <router-link to="/setup">
                        <img src="../../assets/img/侧边栏-我的/icn_set.png" alt=""><span>设置</span>
                    </router-link>
                </li>
            </ul>

            <ul v-if=" identityType != 'driver' ">
              <li>
                <div @click="go('ownerHome')">
                    <img src="../../assets/img/侧边栏-我的/icn_task.png" alt=""><span>收货管理</span>
                </div>
              </li>
              <li v-if=" identityType != 'driver' ">
                <div @click="go('dlrHome')">
                    <img src="../../assets/img/侧边栏-我的/icn_task.png" alt=""><span>发货管理</span>
                </div>
              </li>
              <li v-if=" identityType == 'pcuser' ">
                <div @click="go('usersetting')">
                  <img src="../../assets/img/侧边栏-我的/icn_set.png" alt=""><span>用户设置</span>
                </div>
              </li>
              <li v-if=" identityType == 'customer' ">
                <div @click="go('cusersetting')">
                  <img src="../../assets/img/侧边栏-我的/icn_set.png" alt=""><span>我的</span>
                </div>
              </li>
            </ul>
        </div>

        <appRole></appRole>

      </div>
      <div class="zezhao" @click="$store.state.toggleaside = !$store.state.toggleaside"></div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { getCookie } from "../../js/cookie.js";
import { Toast } from "mint-ui";
import Vue from "vue";
import role from "./roleLogin.vue";
export default {
  data() {
    return {
      driver: {
          driverPic: "",
          driverName: "",
          driverMobile: ""
      },
      identityType: "",
    };
  },
  methods: {
    go(index){
        this.$router.push({
            name: index
        });
        this.$store.state.toggleaside = !this.$store.state.toggleaside;
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
    },
    switchUserIdentity(){
        this.identityType = getCookie("identityType");
        Indicator.open();
        let that = this;
        this.axios.post(`${this.api.baseURL}/userAuth/getCurrentMobileIdentity`).then(res =>{
        Indicator.close();
            if (res.data.success){
                let tmp = res.data.data.result;
                if (this.identityType == "driver"){
                    if(tmp.driverPic){
                        that.driver.driverPic = tmp.driverPic;
                    }else{
                        that.driver.driverPic = null;
                    }
                    that.driver.driverName = tmp.driverName;
                    that.driver.driverMobile = tmp.driverMobile;
                }else if (this.identityType == "pcuser"){
                    if(tmp.picUrl){
                        that.driver.driverPic = tmp.picUrl;
                    }else{
                        that.driver.driverPic = null;
                    }
                    that.driver.driverName = tmp.userName;
                    that.driver.driverMobile = tmp.phone;
                }else if (this.identityType == "customer"){
                    if(tmp.picUrl){
                        that.driver.driverPic = tmp.picUrl;
                    }else{
                        that.driver.driverPic = null;
                    }
                    that.driver.driverName = tmp.userName;
                    that.driver.driverMobile = tmp.phone;
                }else{
                    Toast("未知的用户身份！");
                }
            }else{
                Toast("出现错误，请联系平台客服！");
            }
        });
    },

},
created() {
    this.isdemouser = this.$store.state.isdemouser;
  },
  components: {
    appRole:role
  },
  mounted(){
      this.switchUserIdentity();
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

// 菜单导航栏背景色
bg-col = #ffffff;
col = #383838;

.aside {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;

    .info {
        width: px2rem(400px);
        height: 100%;
        background-color: bg-col;
    }

    // 司机信息
    .user {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        height: px2rem(260px);
        overflow: hidden;
        background-image: url('../../assets/img/侧边栏-我的/background01.png');
        background-size: 100%;

        // 头像
        .photo {
            position: absolute;
            top:px2rem(50px);
            left: px2rem(20px);
            width: px2rem(120px);
            height: px2rem(120px);
            border-radius: 50%;
            background-color: #ffffff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        // 信息
        .information {
            position: absolute;
            top:px2rem(60px);
            left: px2rem(160px);
            color: #ffffff;
            font-size: px2rem(36px);

            .usname button {
                font-size: px2rem(20px);
                background-color: rgba(0, 0, 0, 0);
                border-radius: px2rem(10px);
                padding: px2rem(2px) px2rem(8px);
                border: 1px solid #ffffff;
                text-align: center;
                color: #ffffff;
            }

            .phone {
                margin-top: px2rem(20px);
                font-size :px2rem(28px);
            }
        }
    }

    // 菜单导航栏
    .renwu {
        height: 100%;
        background-color: bg-col;
        box-sizing: border-box;

        ul li {
          font-size: px2rem(40px);
          margin-top: px2rem(50px);
          margin-left: px2rem(40px);

          span {
              margin-left: px2rem(26px);
              color: col;
          }
      }
    }

    // 遮罩层
    .zezhao {
        flex: 1;
        width: 100%;
        height: 100%;
    }
}
</style>


