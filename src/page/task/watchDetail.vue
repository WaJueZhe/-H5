<template>
  <div class="watchDetail">
      <!-- 头部 -->
      <app-comhed :name="headerName" :operation="operation" :flag="false"></app-comhed>
      <!-- 状态栏 -->
    <scroller 
      ref="myscroller" 
      :on-refresh="refresh" 
      :on-infinite="infinite">
      <div class="status">
        <div class="number">运单号：{{ bsTask.taskNo }}</div>
          <div>状态：<span>待接单</span></div>
          <div>联系人：
            <a :href="'tel:'+bsTask.createByPhone">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dianhua1"></use>
                </svg>
                {{bsTask.createByName}}
            </a>
          </div>  
          <div>
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shi"></use>
                </svg>
                {{formatDate(deliverPlanDate)}}
              </span>
              <img src="../../assets/img/inc_Arrow.png">
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhong"></use>
                </svg>
                {{formatDate(unloadPlanDate)}}
              </span>
          </div>
          <div>备注：{{bsTask.taskDesc}}</div>
      </div>
      <!-- 卡片视图 -->
      <div class="card clearfix"  v-for="(item,indexNo) in list" :key="indexNo">
          <tail-card :longitudeX="longitudeX" :latitudeY="latitudeY" :item="item" :indexNo="indexNo" :useSign="bsTask.isUseEsign"></tail-card>
      </div>
    </scroller>
    <!-- 底部按钮 -->
    <div class="footbut">
      <button @click="jujue">拒绝</button>
      <button @click="jiedan(bsTask.id)">接单</button>
    </div>

    <!-- <div class="detail-box" v-show="$store.state.pickUpDetail">
      <div class="info-msg">
        <div class="info-title">提货任务明细
          <span @click="$store.state.pickUpDetail = false"><i class="iconfont icon-close"></i></span>
        </div>
        <div class="info-tab">
        <table align="center" width="100%" border=1 bordercolor="#eee">
          <tbody>
            <tr>
              <td align="center" class="info-waybill">运单号</td>
              <td align="center" class="info-waybill">收货单位</td>
              <td align="center" class="info-waybill">计划发货</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class="info-cent">

        <table align="center" width="100%" border=1 bordercolor="#eee">
          <tbody>
            <tr>
              <td align="center" class="ddd">S324902 <span>TS9342400</span></td>
              <td align="center" class="ddd">收货单位</td>
              <td align="center" class="ddd">计划发货</td>
            </tr>
          </tbody>
        </table>
           <div class="info-waybill">
            <div>运单号</div>
          </div>
          <div class="info-take">收货单位</div>
          <div class="info-plan">计划发货</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import Card from "../../components/task/taskCard.vue";
import { change } from "../../js/numberUtil.js";
import { InfiniteScroll } from "mint-ui";
import { DateFormat } from "../../js/timeUtil.js";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { wx_init } from "../../js/weixin.js";
import wx from "weixin-js-sdk";
import BMap from "BMap"; //引用baiduMap相关的API
import Vue from "vue";
import { MessageBox } from "mint-ui";
Vue.use(InfiniteScroll);
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      pages:0,
      pageNo: 1,
      headerName: "任务详情",
      operation: "",
      pages: 0,
      pageSiz: 1000,
      pageNo: 1,
      list: [],
      taskId: "",
      status: "",
      longitudeX: "",
      latitudeY: "",
      bsTask: "",
      deliverPlanDate: "",
      unloadPlanDate: ""
    };
  },
  components: {
    "tail-card": Card
  },
  methods: {
    //拒绝按钮的点击事件
    jujue() {
      //   this.$router.push("/usual");
      MessageBox.confirm("你确定要拒绝该任务单?").then(action => {
        Indicator.open();
        this.axios
          .post(`${this.api.refuseTask}?taskId=${this.bsTask.id}`)
          .then(res => {
            Indicator.close();
            if (res.data.success) {
              Toast({
                message: "任务已拒绝"
                // iconClass: "icon icon-success"
                
              });
              this.$router.replace("/task0");
            } else {
              Toast("拒绝失败!");
            }
          });
      });
    },
    //接单按钮的点击事件
    jiedan(id) {
      Indicator.open();
      this.axios
        .post(`${this.api.confirmTask}?taskId=${this.bsTask.id}`)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("接单成功");
            this.$router.push({
            name:'task1Detail',
            params:{
              taskid:id
            }
          });
          } else {
            Toast("接单失败!");
          }
        });
    },
    loadTaskList() {
      this.pageNo = this.pageNo + 1;
      Indicator.open();
      this.axios
        .post(
          `${this.api.loadStopList}?taskId=${this.taskId}&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
        )
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = this.list.concat(res.data.data.result.records);
          }
        });
    },
    init() {
      this.taskId = this.$route.params.taskid;
      this.status = this.$route.params.status;
      Indicator.open();
      this.list = [];
      this.pageNo = 1;
      this.axios
        .post(
          `${this.api.loadStopList}?taskId=${this.taskId}&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
        )
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.bsTask = res.data.data.bsTask;
            this.deliverPlanDate = this.bsTask.deliverPlanDate;
            this.unloadPlanDate = this.bsTask.unloadPlanDate;
          }
        });
    },
    translateCallback(data) {
      this.longitudeX = data.points[0].lng;
      this.latitudeY = data.points[0].lat;
    },
    formatDate(val){
        return DateFormat(val,"MM-DD HH:mm");
    },
    /** 
     * 上拉刷新
    */
    refresh(done) {
      let self = this;
      setTimeout(() => {
        this.init();
        done();
      }, 1500);
    },
    /** 
     * 下来刷新
    */
    infinite(done) {
      if (this.noData) {
        setTimeout(() => {
          this.$refs.myscroller.finishInfinite(2);
        });
        return;
      }
      let self = this;
      setTimeout(() => {
        if (this.pageNo >= this.pages) {
          self.noData = "没有更多数据";
        } else {
          this.init();
        }
        self.$refs.myscroller.resize();
        done();
      }, 1500);
    },
  },
  created() {
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
    this.init();
  },
  updated(){
  },
  beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready(function() {
      //获取用户信息
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          _this.longitudeX = res.longitude;
          _this.latitudeY = res.latitude;
        }
      });
    });
  }
};
</script>

<style lang="stylus">
@import '../../components/stylus/mixins.styl';

bgCol = #ececec;
zCl = #383838;
zCl1 = #f68622;
zCl2 = #939393;

.watchDetail {
  padding-top: px2rem(80px);
  height: 100%;
  background-color: bgCol;

  ._v-container > ._v-content {
    padding-top: px2rem(80px);
    padding-bottom: px2rem(80px);
  }

  // 状态栏
  .status {
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    overflow: hidden;
    background-color: #ffffff;
    // margin-top: px2rem(80px);
    box-shadow: px2rem(3px) px2rem(3px) px2rem(3px) rgba(0, 0, 0, 0.3);

    div {
      width: 50%;
      float: left;
      font-size: px2rem(26px);
      color: zCl;
      height: px2rem(60px);
      line-height: px2rem(60px);
      border-bottom: 1px solid #dcdcdc;
    }
    div:first-child{
      width 100%
    }
    div:nth-child(2) span {
      color: zCl1;
      font-weight:bold;
    }

    div:nth-child(3) {
      text-align: right;
    }

    div:nth-child(4) {
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      padding: 0 px2rem(28px);
      box-sizing border-box
      font-size: px2rem(30px);


      img:nth-child(2) {
        margin-left: px2rem(40px);
      }

      span:last-child {
        float: right;
        margin-right: px2rem(20px);
      }
    }

    div:last-child {
      color: zCl2;
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: left;
      border: none;
      font-size: px2rem(26px);
    }
  }

  // 底部按钮
  .footbut {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    padding: px2rem(20px);
    box-sizing: border-box;
    width: 100%;
    height: px2rem(120px);
    background-color: #ffffff;
    font-size: px2rem(30px);
    overflow: hidden;
    box-shadow: px2rem(3px) px2rem(-2px) px2rem(2px) rgba(0, 0, 0, 0.3);

    button {
      display: inline-block;
      border-radius: px2rem(10px);
      text-align: center;
      height: 100%;
      line-height: 100%;
      background-color: #ffffff;
    }

    button:first-child {
      float: left;
      width: 38%;
      border: 1px solid #939393;
      color: zCl;
    }

    button:last-child {
      float: right;
      width: 55%;
      background-color: #2166ff;
      color: #ffffff;
    }
  }

  .card{
    &:last-child {
      padding-bottom :px2rem(80px);
    }
  }

  .detail-box {
      position: fixed;
      top:0;
      left: 0;
      width:100%;
      height:100%;
      background-color:rgba(0,0,0,.3);
      z-index:999;

      .info-msg {
        position: absolute;
        top:50%;
        transform:translateY(-50%);
        width:100%;
        background-color: #fff;

        .info-title {
          padding:px2rem(20px);
          width:100%;
          font-size:px2rem(34px);
          background-color: #eee;
          box-sizing:border-box;

          > span {
            float:right;

            > i {
              font-size:px2rem(40px)
            }
          }
        }

        .info-tab {
          width:100%;
          background-color:#333;
          box-sizing:border-box;

          > table {
            > tbody {
              > tr {
                .info-waybill {
                  padding:px2rem(7px) 0;
                  width:33.333333%;
                  color:#fff;
                }
              }
            }
          }
        }

        .info-cent {
          width:100%;
          max-height:px2rem(400px);
          overflow-y:scroll;
          box-sizing:border-box;

          > table {
            width:100%;
            

            > tbody {
              > tr {
                .ddd {
                  width:33.333333%;
                  padding:0 px2rem(30px);
                  box-sizing:border-box;

                  > span {
                    color:blue;
                  }
                }
              }
            }
          }
        }
      }
    }
}
</style>


