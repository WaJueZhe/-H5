<template>
      <div class="me">
        <!-- 头像 -->
        <div class="header">
          <div class="user">
              <div class="hed" @click="$router.push('/setUp')">
                <img v-if="driver.driverPic != ''&& driver.driverPic !=null" v-bind:src="api.resourceurl+driver.driverPic">
                <img v-if="driver.driverPic == ''|| driver.driverPic ==null" src="static/user.jpg">
              </div>
              <div class="info">
                  <p v-show="!$store.isdemouser">{{driver.driverName}}</p>
                  <p v-show="$store.isdemouser">演示用户</p>
                  <p v-show="!$store.isdemouser" class="phone">{{driver.driverMobile}}</p>
              </div>
          </div>
          <!-- 积分签到 -->
          <div class="integral">
              <!-- <div class="num">
                  <p class="number">{{integral}}</p>
                  <p>当前积分</p>
              </div> -->
              <div class="sign-in" :class="{ 'sign-active': active == true }" @click="addIntegral">
                  <!-- <p><img src="../../assets/img/icn_Sign.png" alt=""></p> -->
                  <p class="sign">{{signIn}}</p>
                  <p class="add">+10分</p>
              </div>
          </div>
        </div>
        <!-- 内容主体 -->
        <div class="main">
          <div class="record">
              <div @click="toggleRecord(0)"><span>今日战绩<i></i></span></div>
              <div @click="toggleRecord(1)"><span>本月战绩<i></i></span></div>
          </div>
          <div class="achieve">
            <div>
                <p>
                  <span v-if="day">{{todaycount}}</span>
                  <span v-if="month">{{monthcount}}</span>
                  <span>单</span>
                </p>
                <p>完成单量</p>
            </div>
            <div>
                <p>
                  <span v-if="day">{{todayDistance}}</span>
                  <span v-if="month">{{monthDistance}}</span>
                  <span>公里</span>
                </p>
                <p>配送里程</p>
            </div>
          </div>
          <div class="rnking">
              <!-- <p>查看排行榜</p> -->
          </div>
        </div>
        <!-- 评论模块 -->
          <app-evalate></app-evalate>
      <!-- 公共底部 -->
     <app-footer></app-footer>
  </div>
    
</template>

<script>
import Evalate from "../../components/me/comment.vue";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      active:false,
      integral:88,
      signIn:'签到',
      select:true,
      driver: "",
      todaycount: 0,
      monthcount: 0,
      todayDistance: 0,
      monthDistance: 0,
      day: true,
      month: false,
    };
  },
  methods: {
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
    //切换战绩的方法
    toggleRecord(id) {
      let arr = document.querySelectorAll(".record i");
      let arr1 = document.querySelectorAll(".record span");
      for (var i = 0; i < arr.length; i++) {
        arr[i].style.display = "none";
        arr1[i].style.fontWeight = "normal";
      }
      arr[id].style.display = "block";
      arr1[id].style.fontWeight = "bold";

      if (id == 0) {
        this.day = true;
        this.month = false;
      }
      if (id == 1) {
        this.day = false;
        this.month = true;
      }
    },
    init() {
      Indicator.open();
      this.axios.post(`${this.api.baseURL}/driver/count`).then(res => {
        Indicator.close();
        console.log(res);
        if (res.data.success) {
          this.driver = res.data.data.driver;
          this.todaycount = res.data.data.todaycount;
          this.monthcount = res.data.data.monthcount;
          this.todayDistance = res.data.data.todayDistance;
          this.monthDistance = res.data.data.monthDistance;
          res.data.data.driver.driverMobile= res.data.data.driver.driverMobile.slice(0,3) +'****'+res.data.data.driver.driverMobile.slice(7);
        }
      });
    },
    //点击增加积分
    addIntegral () {
      if(this.select) {
        this.signIn = '已签到';
        this.integral = this.integral + 10;
        this.active = true;
        Toast("签到成功");
      }
      this.select = false;
    },
  },
  created() {
    this.init();
  },
  components: {
    "app-evalate": Evalate
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

bgCol = #061128; // 战绩线框颜色
zCl = #383838; // 字体颜色
derCol = #dedede; // 战绩线框颜色

.me {
    padding-bottom :px2rem(98px);
    width: 100%;
    height :100%;
    box-sizing: border-box;

    // 头部
    .header {
        position: relative;
        padding: px2rem(30px);
        height: px2rem(300px);
        background-image: url('../../assets/img/pic_my.png');
        background-size: 100% 100%;
        z-index: 1111;

        // 头像
        .user {
            position: absolute;
            top:px2rem(40px);
            left:px2rem(30px);
            width :100%;
            height: px2rem(140px);
            box-sizing: border-box;

            .hed {
              position: absolute;
              top: 0;
              left :0;
              width: px2rem(140px);
              height: px2rem(140px);
              border-radius: 50%;
              background-color: skyblue;

              > img {
                width :100%;
                height :100%;
                border-radius: 50%;
              }
            }

            .info {
              position: absolute;
              top: px2rem(25px);
              left:px2rem(170px);
              font-size: px2rem(36px);
              height: px2rem(120px);
              color: #fff;
              
              .phone {
                padding-top:px2rem(15px);
                font-size :px2rem(28px);
              }
            }
        }

        // 积分签到
        .integral {
            position: absolute;
            bottom: px2rem(30px);
            left: px2rem(30px);
            width: 92%;
            z-index: 2;
            height: px2rem(110px);
            color :#fff;

            .num {
              position: absolute;
              top:0;
              left :0;
              width :px2rem(200px);
              height :100%;
              text-align :center;
              font-size :px2rem(32px);
              box-sizing: border-box;

              .number {
                padding-bottom :px2rem(10px);
                font-size :px2rem(44px);
              }
            }

            .sign-in {
                padding :0 px2rem(30px);
                padding-top:px2rem(10px);
                position: absolute;
                top:0;
                right :0;
                width :px2rem(200px);
                height :100%;
                text-align :center;
                font-size :px2rem(32px);
                border-radius :px2rem(10px);
                background-color #f7748b;
                box-sizing: border-box;
              }

              .sign-active {
                background-color:#ccc;
              }

              .sign {
                padding-bottom: px2rem(6px);
                border-bottom: 1px solid #fff;
              }

              .add {
                padding-top:px2rem(6px);
              }
        }
    }

    // 内容主体
      .main {
        position: fixed;
        top: px2rem(400px) !importanr;
        left: 0px; 
        z-index: 999;
        width: 100%;

        // 战绩
        .record {
            font-size: px2rem(30px);
            background-color: #fff;
            overflow: hidden;

            div {
                position: relative;
                width: 50%;
                height: px2rem(88px);
                line-height: px2rem(88px);
                text-align: center;
                border-bottom: 1px solid derCol;

                i {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40%;
                    height: px2rem(8px);
                    background-color: bgCol;
                    display: none;
                }
            }

            div:first-child {
                float: left;

                span {
                    font-weight: bold;
                }

                i {
                    display: block;
                }
            }

            div:last-child {
                float: right;
            }
        }

        // 单量
        .achieve {
            height: px2rem(140px);
            width: 100%;
            background-color: #fff;
            border-bottom: 1px solid derCol;

            div {
                margin-top: px2rem(20px);
                width: 50%;
                color: zCl;
                text-align: center;
                font-size: px2rem(26px);

                p span:first-child {
                    font-size: px2rem(50px);
                }

                p:first-child {
                    font-weight: 500;
                }

                p:last-child {
                    font-size: px2rem(30px);
                }
            }

            div:first-child {
                float: left;
            }

            div:last-child {
                float: right;
            }
        }

        // 排行榜
        // 排行榜
        // .rnking {
        //     width: 100%;
        //     height: px2rem(68px);
        //     line-height: px2rem(68px);
        //     box-sizing: border-box;
        //     box-shadow: px2rem(0px) px2rem(4px) px2rem(6px) #ddd;
        //     font-size: 15px;
        //     text-align: center;
        // }
    }
   
}
</style>


