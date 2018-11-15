<template>
<div class="task0-page">
  <scroller 
  ref="myscroller" 
  :on-refresh="refresh" 
  :on-infinite="infinite" 
  :loadingLayerColor="bgCol">
    <div class="content">
      <!-- 卡片视图 -->
      <div v-for="(item,indexNo) in list" :key="indexNo" class="card-info">
        <div class="card">
          <div class="titlt">
            <div class="til">任务{{getChinesNo(indexNo+1)}}</div>
            <div class="adress">
              <i class="iconfont icon-dingwei1"></i>
              <span>距你{{getDistance(longitudeX,latitudeY,item.deliveryLongitudeX,item.deliveryLongitudeY)}}公里</span>
            </div>
          </div>
          <div class="xing">
            <div class="left">
              <ul>
                <li>
                  <i class="iconfont icon-yundan"></i>
                  <span>站点数量:
                    <strong>{{item.stopCount}}</strong>
                  </span>
                </li>
                <li>
                  <i class="iconfont icon-shijian"></i>
                  <span>开始时间:
                    <strong>{{formatDate(item.deliverPlanDate)}}</strong>
                  </span>
                </li>
                <li>
                  <i class="iconfont icon-weizhi"></i>
                  <span>任务里程:
                    <strong>大约{{item.totalDistance}}{{item.distanceUnit}}</strong>
                  </span>
                </li>
              </ul>
              <ul>
                <li>{{item.totalUnits}}{{item.unitUnit}}</li>
                <li>{{item.totalVolume}}{{item.volumeUnit}}</li>
                <li>{{item.totalWeight}}{{item.weightUnit}}</li>
              </ul>
            </div>
            <div class="right">
              <span @click="confirmTask(item.id)">接单</span>
            </div>
          </div>
          <router-link :to="{ name: 'watchDetail', params:{taskid: item.id}}" class="chakan">
            <i></i>
            <span>查看详情</span>
            <i class="iconfont icon-jiantou"></i>
          </router-link>
        </div>
      </div>
    </div>
  </scroller>
</div>
</template>

<script>
// 中文数字序列化
import { change } from "../../js/numberUtil.js";
// 配置微信
import { wx_init } from "../../js/weixin.js";
// 计算距离的方法
import { GetDistance } from "../../js/mapUtil.js";
// 计算时间的方法
import { DateFormat } from "../../js/timeUtil.js";
import { InfiniteScroll } from "mint-ui";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
// 引用微信的配置文件
import wx from "weixin-js-sdk";
// 引用baiduMap相关的API
// import BMap from "BMap";
// import Vue from "vue";
// Vue.use(InfiniteScroll);

export default {
  data() {
    return {
      noData: "",
      bgCol: "#383838",
      pages: 0,
      pageSiz: 2,
      pageNo: 1,
      list: [],
      longitudeX: "",
      latitudeY: "",
      driver: {}
    };
  },
  methods: {
    //获取距离长度
    getDistance(lat1, lng1, lat2, lng2) {
      var num = GetDistance(lat1, lng1, lat2, lng2);
      num = num.toFixed(2);
      if (isNaN(num)) num = "-";
      return num;
    },
    //接单
    confirmTask(taskId) {
      // 找到选中的task object，如果是C端发货，则司机需要实名认证
      let i = 0, listLength = this.list.length;
      for (i = 0; i < listLength; i++){
        if (taskId == this.list[i].id){
          break;
        }
      }

      if ((this.list[i].customerOrgId == "0000") && (this.driver.isVerified != "1")){
        let that = this;
        MessageBox.confirm('', {title: "提示", message: "您未实名认证，不能接单！", confirmButtonText: "立即前往", cancelButtonText: "让我想想"
          }).then(action =>{
          that.$router.push('/setup');
          }).catch(err =>{
            // do nothing
          });
        return;
      }
      // 判断完毕

      Indicator.open();
      this.axios.post(`${this.api.confirmTask}?taskId=${taskId}`).then(res => {
        Indicator.close();
        if (res.data.success) {
          Toast("接单成功");
          this.$router.push({
            name:'task1Detail',
            params:{
              taskid:taskId
            }
          });
          // this.init();
        } else {
          Toast("接单失败!");
        }
      });
    },
    /**
		 *下拉刷新
		*/
		refresh (done) {
			setTimeout(() => {
        this.init();
				done();
			}, 1500);
		},
    //上拉加载更多
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
          this.loadTaskList();
        }
        self.$refs.myscroller.resize();
        done();
      }, 1500);
    },
    loadTaskList() {
      this.pageNo = this.pageNo + 1;
      Indicator.open();
      this.axios
        .post(
          `${this.api.loadTaskList}?taskType=0&pageNo=${this.pageNo}&pageSize=${
            this.pageSiz
          }`
        )
        .then(res => {
          Indicator.close();
          if ((res.data.code = 200) && (res.data.data.result)) {
            this.list = this.list.concat(res.data.data.result.records);
          }
        });
    },
    getChinesNo(indexNo) {
      var k = new change(indexNo.toString());
      return k.pri_ary();
    },
    init() {
      this.pageNo = 1;
      this.list = [];
      this.noData = "";
      this.axios
        .post(
          `${this.api.loadTaskList}?taskType=0&pageNo=${this.pageNo}&pageSize=${
            this.pageSiz
          }`
        )
        .then(res => {
          if ((res.data.code == 200) && (res.data.data.result)) {
            this.list = this.list.concat(res.data.data.result.records);
            this.pages = res.data.data.result.pages;
          }
        });
    },
    formatDate(val) {
      return DateFormat(val, "YYYY-MM-DD HH:mm");
    },
    getDriverInfo(){
      let that = this;
      this.axios.post(`${this.api.baseURL}/driver/driverInfo`).then(res => {
        that.driver = res.data.data.driver;
      });
    }
    // translateCallback(data) {
    //   this.longitudeX = data.points[0].lng;
    //   this.latitudeY = data.points[0].lat;
    // }
  },
  created() {
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
    this.init();
    this.getDriverInfo();
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

          // var ggPoint = new BMap.Point(res.longitude, res.latitude);         
          // var convertor = new BMap.Convertor();
          // var pointArr = [];
          // pointArr.push(ggPoint);
          // convertor.translate(pointArr, 1, 5, _this.translateCallback);
        }
      });
    });
  },
//   beforeRouteEnter (to, from, next) {
//   next(vm => {
//     // 通过 `vm` 访问组件实例
    
//     let url = location.href.split("#")[0];
//     wx_init(url);
//     this.init();
//   })
// }
};
</script>

<style lang="stylus">
@import '../../components/stylus/mixins.styl';

// 卡片视图
bg-col = #343d50; // 背景色
col = #383838; // 字体颜色

.task0-page {
  width:100%;
  height:100%;

  .loading-layer {
    padding-bottom:px2rem(240px);
  }

  .content {
    padding: 0 px2rem(20px);
    // margin-top: px2rem(160px);
    
    .card {
      margin-top: px2rem(20px);
      // height: px2rem(400px);
      border-radius: px2rem(20px);
      overflow: hidden;
      box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;
      background-color: #ffffff;

      // 卡片标题
      .titlt {
        width: 100%;
        box-sizing: border-box;
        padding: 0 px2rem(20px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        background-color: bg-col;
        overflow: hidden;

        .til {
          float: left;
          font-size: px2rem(40px);
          color: #ffffff;
        }

        .adress {
          float: right;
          color: #ffffff;
          font-size: px2rem(26px);
        }
      }

      // 卡片内容区域
      .xing {
        padding: 0 px2rem(20px);
        overflow: hidden;
        // width: 100%;
        // height: px2rem(260px);

        .left {
          float: left;

          ul:first-child {

            li {
              color: col;
              margin-top: px2rem(16px);
              font-size:px2rem(30px);

              span {
                margin-left: px2rem(20px);

                > strong {
                  font-size:px2rem(28px);
                }
              }
            }
          }

          ul:last-child {
            margin-top: px2rem(20px);
            margin-bottom: px2rem(10px);
            padding-left: px2rem(50px);
            font-size:px2rem(28px);

            li {
              display: inline-block;
              border: 1px solid #999ea7;
              padding: px2rem(8px) 0;
              border-radius: px2rem(6px);
              font-size:px2rem(24px);
              color:#333;
            }
          }
        }

        .right {
          float: right;

          span {
            display: inline-block;
            width: px2rem(140);
            height: px2rem(140);
            line-height: px2rem(140);
            border-radius: 50%;
            text-align: center;
            background-color: #2166ff;
            color: #ffffff;
            font-size: px2rem(40px);
            font-weight: 500;
            margin-right: px2rem(20px);
            margin-top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      // 查看详情
      .chakan {
        position: relative;
        display: inline-block;
        height: px2rem(70px);
        line-height: px2rem(70px);
        box-sizing: border-box;
        padding: 0 px2rem(20px);
        width: 100%;
        width: 100%;

        i:first-child {
          position: absolute;
          top: 0;
          left: px2rem(20px);
          width: px2rem(670px);
          height: 1px;
          background-color: #dedede;
        }

        span:nth-child(2) {
          font-size: px2rem(30px);
          float: left;
        }

        i:last-child {
          float: right;
          font-size: px2rem(30px);
        }
      }
    }
  }
}
</style>


