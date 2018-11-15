<template>

  <div class="history">
    <app-comhed class="hed"  :name='headerName' :operation="operation" :flag="false"></app-comhed>
    <scroller ref="myscroller" :on-refresh="refresh" :on-infinite="infinite" :loadingLayerColor="bgCol" class="vontent">
    <div v-for="(item,indexNo) in list" :key="indexNo" class="cardview">
        <!-- 卡片视图 -->
      <div class="card">
        <div class="titlt">
          <div class="til">任务编号：{{item.taskNo}}</div>
          <div class="adress">
            <span>已完成</span>
          </div>
        </div>
        <div class="xing">
          <div class="left">
            <ul>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yundan1"></use>
                </svg>
                <span>站点数量:
                  <strong>{{item.stopCount}}</strong>
                </span>
              </li>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shijian"></use>
                </svg>
                <span>任务开始时间:
                  <strong>{{formatDate(item.deliverPlanDate)}}</strong>
                </span>
              </li>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weizhi"></use>
                </svg>
                <span>大约行驶：
                  <strong>{{item.totalDistance}}{{item.distanceUnit}}</strong>
                </span>
              </li>
            </ul>
            <ul>
                  <li>{{item.totalUnits}}{{item.unitUnit}}</li>
                  <li>{{item.totalVolume}}{{item.volumeUnit}}</li>
                  <li>{{item.totalWeight}}{{item.weightUnit}}</li>
            </ul>
          </div>
        </div>
        <router-link :to="{ name: 'historyDetail', params:{taskid: item.id}}" class="chakan">
            <i></i>
            <span class="dtr">
                <span v-if="item.isDriverConfirmed==null||item.isDriverConfirmed==''" class="lookDetail">查看详情</span>
                <span v-if="item.isDriverConfirmed==0" class="unconfirmed">[待确认货损货差]</span>
                <span v-if="item.isDriverConfirmed==1" class="confirmed">[已确认货损货差]</span>
              <span><img src="../../assets/img/inc_r.png" alt=""></span>
            </span>
        </router-link>
      </div>
    </div>
    </scroller>
  </div>

</template>

<script>
import { DateFormat } from "../../js/timeUtil.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      headerName: "历史任务",
      operation: "",
      noData: "",
      bgCol: "#383838",
      pages: 0,
      pageSiz: 10,
      pageNo: 1,
      list: []
    };
  },
  methods: {
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
    infinite(done) {
      if (this.noData) {
        setTimeout(() => {
          this.$refs.myscroller.finishInfinite(1);
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
    formatDate(val) {
      return DateFormat(val, "YYYY-MM-DD HH:mm");
    },
    loadTaskList() {
      // console.log("获取更多任务列表");
      this.pageNo = this.pageNo + 1;
      Indicator.open();
      this.axios
        .post(
          `${this.api.loadTaskList}?taskType=10&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
        )
        .then(res => {
          Indicator.close();
          if ((res.data.code = 200)) {
            this.list = this.list.concat(res.data.data.result.records);
          }
        });
    },
    init() {
      //   Indicator.open();
      this.pageNo = 1;
      this.list = [];
      this.noData = "";
      this.axios
        .post(
          `${this.api.loadTaskList}?taskType=10&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
        )
        .then(res => {
          //   Indicator.close();
          // console.log(res);
          if (res.data.code == 200) {
            this.list = this.list.concat(res.data.data.result.records);
            this.pages = res.data.data.result.pages;
          }
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.vontent {
  padding-top: px2rem(80px);
}


.history {
  .cardview {
    padding: 0 px2rem(20px);
    box-sizing: border-box;
  }
}

bg-col = #343d50; // 背景色
col = #383838; // 字体颜色

.card {
  margin-top: px2rem(20px);
  // height: px2rem(400px);
  border-radius: px2rem(20px);
  overflow: hidden;
  box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;
  background-color: #fff;

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
      font-size: px2rem(30px);
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
          margin-top: px2rem(10px);
          font-size: px2rem(30px);

          span {
            margin-left: px2rem(20px);
          }
        }
      }

      ul:last-child {
        margin-top: px2rem(10px);
        margin-bottom :px2rem(10px);
        padding-left: px2rem(50px);

        li {
          display: inline-block;
          border: 1px solid #999ea7;
          padding: px2rem(2px) px2rem(6px);
          border-radius: px2rem(6px);
        }
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

    i {
      position: absolute;
      top: 0;
      left: px2rem(20px);
      width: px2rem(670px);
      height: 1px;
      background-color: #dedede;
    }

    .dtr {
      width: 100%;
      color: col;
      font-size: px2rem(30px);

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

    .lookDetail {
      float: left;
    }

    .unconfirmed{
      float: left;
      color:#ff3300;
      font-weight :bold;
    }
    .confirmed{
      float: left;
      color:#006600;
      font-weight :bold;
    } 

      span:last-child {
        float: right;
      }
    }
  }
}
</style>


