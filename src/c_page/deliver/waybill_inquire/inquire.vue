<template>
  <div class="inquire-page">
    <commonalityHeader :name="headerName" :operation="operation" :flag="false" :back="true">
      <div class="slot" slot="right">
          <span v-if=" $route.path == '/waybill_inquire/inquire' " @click="isTime = true"><i class="iconfont icon-set"></i></span>
      </div>
    </commonalityHeader>
    <div class="serch">
      <div class="input">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="请输入运单信息" v-model="searchKey">
      </div>
      <button @click="queryWithKey()">查询</button>
    </div>
    <!-- <scroller :on-refresh="refresh"> -->
      <div class="serch-box">
        <div class="search-item">
          <!-- <inquireCard class="code"></inquireCard> -->
          <list0 :task_criteria="this.task_criteria"></list0>
        </div>
        <!-- <div v-show="loadmore" @click="loadmoredata" class="more">点击加载更多</div>
        <div v-show="havemore" class="nomore">没有更多数据了</div> -->
      </div>
    <!-- </scroller> -->

    <!-- 选择时间弹框 -->
    <div class="select-box" v-show="isTime">
      <div class="select-data">
        <div class="time">查询时间</div>
        <div class="choose">
          <div class="input">
            <label class="label">
              <input type="radio" name="data" @click="querySum(1)">
              今天
            </label>
          </div>
          <div class="input">
            <label class="label">
              <input type="radio" name="data" @click="querySum(5)">
              本月
            </label>
          </div>
          <div class="input">
            <label class="label">
              <input type="radio" name="data" @click="querySum(2)">
              近3天
            </label>
          </div>
          <div class="input">
            <label class="label">
              <input type="radio" name="data" @click="querySum(4)">
              上月
            </label>
          </div>
          <div class="input">
            <label class="label">
              <input type="radio" name="data" @click="querySum(3)">
              近7天
            </label>
          </div>
        </div>
        <div class="select-btn">
          <div class="cancel" @click="isTime = false">取消</div>
          <!-- <div class="confirm">确定</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import list0 from "../list/list0";
import moment from "moment";
import { Toast } from "mint-ui";
import { getCookie } from "../../../js/cookie.js";
export default {
  data () {
    return {
      headerName:'运单查询',
      operation:'',
      searchStr: "",
      pageNo: 1,
      pageSize: 10,
      list: [],
      count: 0,
      pages: 0,
      havemore: false,
      loadmore: false,
      isTime: false,
      signerTel: "",
      signerTimeBegin: "",
      signerTimeEnd: "",
      searchKey: "",
      isInTransit: "",
      isSignedOK: "",
      pageNo: "1",
      pageSize: "5",
      task_criteria: {},
    }
  },
  methods: {
     /**
		 *上拉刷新
		*/
		refresh (done) {
			setTimeout(() => {
				done();
			}, 1500);
    },
    queryWithKey(){
      this.task_criteria = {"signerTel": this.signerTel, "signerTimeBegin": moment().add(-1, "years").format("YYYY") + "-01-01", 
              "signerTimeEnd": moment().format("YYYY-MM-DD"), 
              "searchKey": this.searchKey, "pageNo": this.pageNo, "pageSize": this.pageSize};
    },
    querySum(typeCode){
      this.searchKey = ""; //日期快捷查询， 先清除查询条件
      let dteToday = new Date();
      switch (typeCode) {
        case 1:
          this.signerTimeBegin = moment(dteToday).format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        case 2:
          this.signerTimeBegin = moment().add(-2, "days").format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        case 3:
          this.signerTimeBegin = moment().add(-6, "days").format("YYYY-MM-DD");
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        case 4:
          this.signerTimeBegin = moment().add(-1, "months").format("YYYY-MM") + "-01";
          let tmpStr = moment().format("YYYY-MM") + "-01";
          this.signerTimeEnd = moment(tmpStr).add(-1, "days").format("YYYY-MM-DD");
          break;
        case 5:
          this.signerTimeBegin = moment().format("YYYY-MM") + "-01";
          this.signerTimeEnd = moment(dteToday).format("YYYY-MM-DD");
          break;
        default:
          break;
      }
      this.task_criteria = {"signerTel": this.signerTel, "signerTimeBegin": this.signerTimeBegin, "signerTimeEnd": this.signerTimeEnd, 
              "searchKey": this.searchKey, "pageNo": this.pageNo, "pageSize": this.pageSize};
      this.isTime = false;

    },
  },
  created(){
    this.signerTel = getCookie("phone");
  },
  mounted(){
    this.signerTel = getCookie("phone");
  },
  components: {
    list0,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../components/stylus/mixins.styl';

.inquire-page {
  width:100%;
  height:100%;

  .slot {
    > span {
      padding:0 px2rem(10px);
    }
  }

  .serch {
    position: fixed;
    top:px2rem(80px);
    padding: px2rem(20px);
    width:100%;
    box-sizing: border-box;
    background-color: #061128;
    z-index:2222;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .input {
      padding-left: px2rem(40px);
      float: left;
      width:85%;
      height: px2rem(90px);
      border-top-left-radius: px2rem(10px);
      border-bottom-left-radius: px2rem(10px);
      background-color: #fff;
      box-sizing: border-box;

      > i {
        font-size:px2rem(46px);
        vertical-align:middle
      }
      

      > input {
        width: 90%;
        height: 100%;
        font-size: px2rem(30px);
        border-radius: px2rem(10px);
      }
    }

    button {
      float right;
      width: 15%;
      height: px2rem(90px);
      background-color: #2d85de;
      color: #ffffff;
    }
  }

  .serch-box {
    position: fixed;
    top: px2rem(210px);
    width: 100%;
    height:100%;
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    padding-top: px2rem(10px);
    margin-bottom: px2rem(120px);
    background-color: #ececec;

    .search-item {
      width: 100%;

      &:last-child {
         padding-bottom:px2rem(160px);
         margin-bottom: 0;
      }
    }

    .code {
      margin-bottom: px2rem(20px);
    }
  }

  .select-box {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,.3);
    z-index:2222;

    .select-data {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      padding:px2rem(20px);
      width:85%;
      background-color: #fff;
      border-radius:px2rem(10px);
      box-sizing:border-box;
      z-index:3333;

      .time {
        font-size:px2rem(30px);
      }

      .choose {
        padding:px2rem(60px) px2rem(120px);
        padding-bottom:0;
        box-sizing:border-box;

        &:after {
          display:block;
          clear: both;
          content:' ';
        }

        .input {
          margin-bottom:px2rem(40px);
          width:50%;
          float: left;

          > label {
            width:100%;
            height:100%;
            font-size:px2rem(28px);

            > input {
              margin-right:px2rem(6px);
              width:px2rem(35px);
              height:px2rem(35px);
              vertical-align:middle;
            }
          }
        }
      }
    }

    .select-btn {
      width:100%;
      height:px2rem(60px);
      line-height:px2rem(60px);
      font-size:px2rem(30px);
      display:flex;
      justify-content:space-between;
      box-shadow: 0 0 px2rem(12px) px2rem(8px) #eee;

      > div {
        flex:1;
        text-align:center;
        color:#666;

        &:last-child {
          border-left:1px solid #eee;
          color:#2196f3;
        }
      }
    }
  }

  // 点击加载更多
  .more, .nomore {
    padding-bottom: px2rem(150px);
    width: 100%;
    text-align: center;
    height: px2rem(80px);
    line-height: px2rem(80px);
    font-size: px2rem(28px);
    color: #383838;
  }
}

</style>
