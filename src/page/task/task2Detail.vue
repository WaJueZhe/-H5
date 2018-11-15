<template>
  <div class="detail">
      <!-- 头部 -->
      <app-comhed :name="headerName" :operation="operation" :flag="false"></app-comhed>
      <!-- 状态栏 -->
    <scroller
      ref="myscroller" 
      :on-refresh="refresh" 
      :on-infinite="infinite" class="vontent">
      <div class="status">
        <div class="number">运单号：{{ bsTask.taskNo }}</div>
          <div>状态：
            <span>{{bsTask.status|taskStatus}}</span>
            <!-- <span v-if="bsTask.status=='98'">已拒接</span> 
            <span v-if="bsTask.status=='99'">已取消</span> -->
          </div>
          <div>联系人：<a :href="'tel:'+bsTask.createByPhone">
            <span><i class="iconfont icon-dianhua1"></i>{{bsTask.createByName}}</span></a>
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
      <div class="card"  v-for="(item,indexNo) in list" :key="indexNo">
          <tail-card :longitudeX="longitudeX" :latitudeY="latitudeY" :item="item" :indexNo="indexNo" :useSign="bsTask.isUseEsign"></tail-card>
      </div>
    </scroller>
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
// import BMap from "BMap"; //引用baiduMap相关的API
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
  filters: {
    taskStatus: function(value) {
      let result = "";
      switch (value) {
        case "0":
          result = "未接单";
          break;
        case "1":
          result = "已接单";
          break;
        case "2":
          result = "执行中";
          break;
        case "10":
          result = "已完成";
          break;
        case "98":
          result = "已拒绝";
          break;
        case "99":
          result = "已取消";
          break;          
      }
      return result;
    },
    ifNull:function(value){
      if(value==null||value==''){
        return "-"
      }else{
        return value;
      }
    }
  },
  methods: {
    //接单按钮的点击事件
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
    formatDate(val) {
      return DateFormat(val, "MM-DD HH:mm");
    },
    /** 
     * 上拉刷新
    */
    refresh(done) {
      let self = this;
      setTimeout(() => {
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

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

bgCol = #ececec;
zCl = #383838;
zCl1 = #f68622;
zCl2 = #939393;

.vontent {
  padding-top: px2rem(80px);
}
.detail {
  background-color: bgCol;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-bottom: px2rem(120);

  .status {
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    overflow: hidden;
    background-color: #ffffff;
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

    div:first-child {
      width: 100%;
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
      box-sizing: border-box;
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
      padding-bottom :px2rem(100px);
    }
  }
}
</style>


