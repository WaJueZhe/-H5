<template>
  <div class="task2-page">
    <scroller 
      ref="myscroller" 
      :on-refresh="refresh" 
      :on-infinite="infinite" 
      :loadingLayerColor="bgCol">
        <div class="yichang">
            <!-- 卡片视图 -->
        <div v-for="(item,indexNo) in list" :key="indexNo">
            <div class="card">
                <div class="titlt">
                    <div class="til">任务编号：{{item.taskNo}}</div>
                    <div class="adress">
                        <span>{{item.status|taskStatus}}</span> 
                    </div>
                </div>
                <div class="xing">
                    <div class="left">
                        <ul>
                            <li><i class="iconfont icon-yundan"></i><span>站点数量:<strong>{{item.stopCount}}</strong></span></li>
                            <li><i class="iconfont icon-shijian"></i><span>任务开始时间:<strong>{{item.deliverPlanDate}}</strong></span></li>
                            <li><i class="iconfont icon-weizhi"></i><span>大约行驶：<strong>{{item.totalDistance}}{{item.distanceUnit}}</strong></span></li>
                        </ul>
                        <ul>
                            <li>{{item.totalUnits}}{{item.unitUnit}}</li>
                            <li>{{item.totalVolume}}{{item.volumeUnit}}</li>
                            <li>{{item.totalWeight}}{{item.weightUnit}}</li>
                        </ul>
                    </div>
                </div>
                <router-link :to="{ name: 'task2Detail', params:{taskid: item.id}}" class="chakan">
                    <i></i>
                    <span v-if="item.isDriverConfirmed==null||item.isDriverConfirmed==''">查看详情</span>
                    <span v-if="item.isDriverConfirmed==0"><span class="unconfirmed">[待确认货损货差]</span>查看详情</span>
                    <span v-if="item.isDriverConfirmed==1"><span class="confirmed">[已确认货损货差]</span>查看详情</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>

            </div>
        </div>
        </div>
    </scroller>
  </div>
</template>

<script>
import { change } from "../../js/numberUtil.js";
import { wx_config } from "../../js/weixin.js";
import { InfiniteScroll } from "mint-ui";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import Vue from "vue";
// Vue.use(InfiniteScroll);

export default {
  data() {
    return {
      noData: "",
      bgCol: "#383838",
      pages: 0,
      pageSiz: 5,
      pageNo: 1,
      list: []
    };
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
     /**
		 *上拉刷新
		*/
		refresh (done) {
			setTimeout(() => {
        this.init();
				done();
			}, 1500);
		},
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
          `${this.api.loadTaskList}?taskType=2&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
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
      //   Indicator.open();

      this.pageNo = 1;
      this.list = [];
      this.noData = "";
      this.axios
        .post(
          `${this.api.loadTaskList}?taskType=2&pageNo=${this
            .pageNo}&pageSize=${this.pageSiz}`
        )
        .then(res => {
          if ((res.data.code = 200) && (res.data.data.result)) {
            this.list = this.list.concat(res.data.data.result.records);
            this.pages = res.data.data.result.pages;
          }
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="stylus">
@import '../../components/stylus/mixins.styl';

// 卡片视图
bg-col = #343d50; // 背景色
col = #383838; // 字体颜色
.task2-page {
  width:100%;
  height:100%;

  ._v-container>._v-content {
    padding-bottom: px2rem(240px);
  }

  .yichang {
    padding: 0 px2rem(20px);
    // margin-top: px2rem(160px);
    background-color: #ececec;

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
                font-size: px2rem(30px);
                color: #ffffff;
            }

            .adress {
                float: right;
                color: #ffffff;
                font-size: px2rem(26px);

                span:first-child {
                    img {
                        vertical-align: middle;
                    }
                }

                span:last-child {
                    vertical-align: middle;
                }
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
                        font-size: px2rem(30px);

                        span {
                            margin-left: px2rem(20px);
                            > strong {
                              font-size:px2rem(28px);
                          }
                        }
                    }
                }

                ul:last-child {
                    margin-top: px2rem(10px);
                    margin-bottom:px2rem(10px);
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

                a {
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
                    margin-right: px2rem(74px);
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

    .unconfirmed{
      color:#ff3300;
      font-weight :bold;
    }
    .confirmed{
      color:#006600;
      font-weight :bold;
    }    
  }
}

</style>


