<template>
  <div class="check">
    <div class="header">
      <div class="hed">查单</div>
      <div class="serch">
        <input type="text" v-model="searchStr" placeholder="请输入关键字">
        <button @click="search(searchStr)">查询</button>
      </div>
    </div>
  <scroller :on-refresh="refresh">
    <div class="content">
      <div class="main" v-for="(item,index) in list" :key="index">
        <serch-card v-bind:detail="item" class="code"></serch-card>
      </div>
      <div v-show="loadmore" @click="loadmoredata" class="more">点击加载更多</div>
      <div v-show="havemore" class="nomore">没有更多数据了</div>
    </div>
  </scroller>

    <app-footer></app-footer>
  </div>
</template>

<script>
import SerchCard from "../../components/serch/serchCard.vue";
import { Indicator } from "mint-ui";
export default {
  watch: {
    searchStr: "changeStr"
  },
  data() {
    return {
      pickerVisible: {
        year: "2017",
        mouth: "12",
        date: "12"
      },
      searchStr: "",
      pageNo: 1,
      pageSize: 10,
      list: [],
      count: 0,
      pages: 0,
      havemore: false,
      loadmore: true
    };
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
    changeStr() {
      this.pageNo = 1;
      this.list = [];
      this.havemore = false;
      this.loadmore = true;
    },
    loadmoredata() {
      if (this.pageNo >= this.pages) {
        this.loadmore = false;
        this.havemore = true;
        return;
      }
      this.pageNo = this.pageNo + 1;
      this.search(this.searchStr);
    },
    search(searchStr) {
      Indicator.open();
      let param = {
        "searchStr": searchStr,
        "pageNo": this.pageNo,
        "pageSize": this.pageSize
      };

      this.axios
        .post(`${this.api.baseURL}/task/searchTaskh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = this.list.concat(res.data.data.result.records);
            this.count = res.data.data.result.total;
            this.pages = res.data.data.result.pages;
          } else {
          }
        });
    }
  },
  render: function(h) {
    return h("span", { style: { color: "red" } }, this.list);
  },

  created() {
    this.list = [];
  },
  mounted () {
  },
  components: {
    "serch-card": SerchCard
  },
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

zCL = #383838;

.check {
  width: 100%;
  margin-top: px2rem(220px);

  // 头部搜索框
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #08132a;
    z-index: 222;

    .hed {
      width: 100%;
      height: px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      color: #ffffff;
      font-size: px2rem(36px);
    }

    .serch {
      padding: px2rem(20px);
      box-sizing: border-box;
      position: relative;

      input {
        width: 100%;
        height: px2rem(90px);
        box-sizing: border-box;
        padding-left: px2rem(40px);
        border-radius: px2rem(10px);
        font-size: px2rem(30px);
        background-color: #ffffff;
      }

      button {
        position: absolute;
        right: 0;
        top: px2rem(20px);
        width: px2rem(100px);
        height: px2rem(90px);
        background-color: #2d85de;
        color: #ffffff;
      }
    }
  }

  .content {
    width: 100%;
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    padding-top: px2rem(10px);
    margin-bottom: px2rem(120px);
    background-color: #ececec;
    margin-top :px2rem(240px);

    .main {
      width: 100%;

      &:first-child {
        //  padding-top:px2rem(240px);
        // margin-top :px2rem(240px);
      }

      &:last-child {
         padding-bottom:px2rem(160px);
         margin-bottom: 0;
      }
    }

    .code {
      margin-bottom: px2rem(20px);

      // &:last-child {
      //    margin-bottom: 0;
      // }
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
</style>
